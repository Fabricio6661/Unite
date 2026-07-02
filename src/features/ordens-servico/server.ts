import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { ordensServico, osHistorico, osMateriais, materiais, osArquivos, estoqueMovimentacoes } from '@/db/schema'
import { eq, sql, count } from 'drizzle-orm'
import {
  osSchema,
  osConclusaoSchema,
  osReagendamentoSchema,
  osCancelamentoSchema,
} from './schema'
import { z } from 'zod'
import { uploadFileToStorage, deleteFileFromStorage } from '@/lib/supabase-storage'
import { requireTecnicoOrAdmin } from '@/lib/auth-server'
import { getEstoqueUnidadeLabel } from '@/lib/utils'
import { gerarNumeroOs } from './numero-os'

export const getOrdensServico = createServerFn({ method: 'GET' }).handler(
  async () => {
    const auth = await requireTecnicoOrAdmin()
    
    return await db.query.ordensServico.findMany({
      where: (os, { eq }) => auth.userType === 'tecnico' ? eq(os.tecnicoId, auth.userId) : undefined,
      with: {
        cliente: true,
        tecnico: true,
        arquivos: true,
      },
      orderBy: (os, { desc }) => [desc(os.createdAt)],
    })
  },
)

export const getOrdemServico = createServerFn({ method: 'GET' })
  .validator(z.number())
  .handler(async ({ data }) => {
    const auth = await requireTecnicoOrAdmin()
    const os = await db.query.ordensServico.findFirst({
      where: eq(ordensServico.id, data),
      with: {
        cliente: true,
        tecnico: true,
        materiais: { with: { material: true } },
        historico: {
          with: { usuario: true },
          orderBy: (h, { desc }) => [desc(h.dataHora)],
        },
        arquivos: {
          orderBy: (a, { desc }) => [desc(a.createdAt)],
        },
      },
    })
    
    if (os && auth.userType === 'tecnico' && os.tecnicoId !== auth.userId) {
      throw new Error('Acesso negado')
    }
    
    return os
  })

export const getOsArquivos = createServerFn({ method: 'GET' })
  .validator(z.number())
  .handler(async ({ data }) => {
    return await db.query.osArquivos.findMany({
      where: eq(osArquivos.osId, data),
      orderBy: (a, { desc }) => [desc(a.createdAt)],
    })
  })

export const uploadOsArquivo = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      osId: z.number(),
      arquivos: z.array(
        z.object({
          nome: z.string(),
          arquivoBase64: z.string(),
          mimeType: z.string(),
        })
      ),
    }),
  )
  .handler(async ({ data }) => {
    // Check if OS already has 5 files
    const [fileCount] = await db
      .select({ count: count() })
      .from(osArquivos)
      .where(eq(osArquivos.osId, data.osId))
    
    if (fileCount.count + data.arquivos.length > 5) {
      throw new Error('Limite de 5 arquivos por OS atingido')
    }

    const novosArquivos = []
    for (const arquivo of data.arquivos) {
      // Convert base64 to buffer
      const buffer = Buffer.from(arquivo.arquivoBase64, 'base64')

      // Upload to Supabase Storage
      const storageResult = await uploadFileToStorage(
        arquivo.nome,
        buffer,
        arquivo.mimeType,
        data.osId,
      )

      // Save to database
      const [novoArquivo] = await db
        .insert(osArquivos)
        .values({
          osId: data.osId,
          nome: arquivo.nome,
          tipoArquivo: arquivo.mimeType.startsWith('image/') ? 'imagem' : 'documento',
          arquivoPath: storageResult.fileId,
          arquivoUrl: storageResult.publicUrl,
        })
        .returning()
      
      novosArquivos.push(novoArquivo)
    }

    // Return all arquivos for this OS
    return await db.query.osArquivos.findMany({
      where: eq(osArquivos.osId, data.osId),
      orderBy: (a, { desc }) => [desc(a.createdAt)],
    })
  })

export const deleteOsArquivo = createServerFn({ method: 'POST' })
  .validator(z.number())
  .handler(async ({ data }) => {
    // Get the file first to get the file path
    const arquivo = await db.query.osArquivos.findFirst({
      where: eq(osArquivos.id, data),
    })
    if (!arquivo) {
      throw new Error('Arquivo não encontrado')
    }

    // Delete from Supabase Storage
    try {
      await deleteFileFromStorage(arquivo.arquivoPath)
    } catch (e) {
      console.error('Erro ao deletar arquivo do Supabase Storage:', e)
    }

    // Delete from database
    await db.delete(osArquivos).where(eq(osArquivos.id, data))

    return { success: true }
  })

export const createOrdemServico = createServerFn({ method: 'POST' })
  .validator(osSchema)
  .handler(async ({ data }) => {
    const status = data.dataAgendada ? 'agendada' : (data.status || 'aberta')

    const [novaOs] = await db
      .insert(ordensServico)
      .values({
        numero: gerarNumeroOs(),
        clienteId: data.clienteId,
        tipoServico: data.tipoServico,
        descricaoProblema: data.descricaoProblema,
        observacoes: data.observacoes,
        prioridade: data.prioridade,
        dataAgendada: data.dataAgendada ? new Date(data.dataAgendada) : null,
        tecnicoId: data.tecnicoId,
        valor: data.valor || null,
        status: status,
      })
      .returning()

    // Registrar no histórico
    await db.insert(osHistorico).values({
      osId: novaOs.id,
      acao: 'criacao',
      statusNovo: novaOs.status,
      detalhes: 'OS criada pelo sistema',
    })

    return novaOs
  })

export const concluirOrdemServico = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.number(), data: osConclusaoSchema }))
  .handler(async ({ data }) => {
    const auth = await requireTecnicoOrAdmin()

    return await db.transaction(async (tx) => {
      const osAtual = await tx
        .select()
        .from(ordensServico)
        .where(eq(ordensServico.id, data.id))
        .then((res) => res[0])

      if (!osAtual) {
        throw new Error('Ordem de Serviço não encontrada')
      }

      if (auth.userType === 'tecnico' && osAtual.tecnicoId !== auth.userId) {
        throw new Error('Acesso negado')
      }

      if (osAtual.status === 'cancelada' || osAtual.status === 'concluida') {
        throw new Error('Não é possível editar uma OS cancelada ou concluída')
      }

      if (data.data.materiais.length > 0) {
        for (const mat of data.data.materiais) {
          const quantidade = Number(mat.quantidade)
          if (!Number.isFinite(quantidade) || quantidade <= 0) {
            throw new Error('Quantidade de material inválida')
          }

          const [materialAtual] = await tx
            .select()
            .from(materiais)
            .where(eq(materiais.id, mat.materialId))

          if (!materialAtual) {
            throw new Error(`Material não encontrado (ID: ${mat.materialId})`)
          }

          if (auth.userType === 'tecnico' && materialAtual.assignedTecnicoId !== auth.userId) {
            throw new Error(`Você não tem permissão para usar o material ${materialAtual.descricao}. Ele não pertence ao seu estoque.`)
          }

          const saldoAtual = Number(materialAtual.quantidade)
          const unidadeLabel = getEstoqueUnidadeLabel(materialAtual)

          if (materialAtual.unidade !== 'M' && !Number.isInteger(quantidade)) {
            throw new Error(`O material ${materialAtual.descricao} é controlado por unidade e aceita apenas valores inteiros.`)
          }

          if (quantidade > saldoAtual + 1e-9) {
            throw new Error(
              `Estoque insuficiente para ${materialAtual.descricao}. Disponível: ${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 3 }).format(saldoAtual)} ${unidadeLabel}. Solicitado: ${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 3 }).format(quantidade)} ${unidadeLabel}.`,
            )
          }

          await tx.insert(osMateriais).values({
            osId: data.id,
            materialId: mat.materialId,
            quantidade: String(quantidade),
            tipoUso: mat.tipoUso,
            localSaida: mat.localSaida,
          })

          await tx
            .update(materiais)
            .set({ quantidade: sql`${materiais.quantidade} - ${quantidade}` })
            .where(eq(materiais.id, mat.materialId))

          await tx.insert(estoqueMovimentacoes).values({
            materialId: mat.materialId,
            tipo: 'SAIDA_OS',
            quantidade: String(quantidade),
            ordemServicoId: data.id,
            usuarioId: auth.userId,
          })
        }
      }

      const [osAtualizada] = await tx
        .update(ordensServico)
        .set({
          status: 'concluida',
          dataInicioEfetivo: data.data.dataInicioEfetivo
            ? new Date(data.data.dataInicioEfetivo)
            : null,
          dataTerminoEfetivo: data.data.dataTerminoEfetivo
            ? new Date(data.data.dataTerminoEfetivo)
            : null,
          observacoesFinais: data.data.observacoesFinais,
          speedTestPing:
            data.data.speedTestPing != null
              ? String(data.data.speedTestPing)
              : null,
          speedTestDownload:
            data.data.speedTestDownload != null
              ? String(data.data.speedTestDownload)
              : null,
          speedTestUpload:
            data.data.speedTestUpload != null
              ? String(data.data.speedTestUpload)
              : null,
          speedTestDataHora: data.data.speedTestDataHora
            ? new Date(data.data.speedTestDataHora)
            : null,
        })
        .where(eq(ordensServico.id, data.id))
        .returning()

      await tx.insert(osHistorico).values({
        osId: data.id,
        acao: 'conclusao',
        statusNovo: 'concluida',
        detalhes: 'OS finalizada pelo técnico',
      })

      return osAtualizada
    })
  })

export const reagendarOrdemServico = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.number(), data: osReagendamentoSchema }))
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      // Verificar status atual da OS
      const osAtual = await tx
        .select()
        .from(ordensServico)
        .where(eq(ordensServico.id, data.id))
        .then((res) => res[0])

      if (!osAtual) {
        throw new Error('Ordem de Serviço não encontrada')
      }

      const auth = await requireTecnicoOrAdmin()
      if (auth.userType === 'tecnico' && osAtual.tecnicoId !== auth.userId) {
        throw new Error('Acesso negado')
      }

      if (osAtual.status === 'cancelada' || osAtual.status === 'concluida') {
        throw new Error(
          'Não é possível reagendar uma OS cancelada ou concluída',
        )
      }

      const [osAtualizada] = await tx
        .update(ordensServico)
        .set({
          status: 'reagendada',
          dataAgendada: new Date(data.data.novaDataAgendada),
          ...(data.data.tecnicoId ? { tecnicoId: data.data.tecnicoId } : {}),
        })
        .where(eq(ordensServico.id, data.id))
        .returning()

      await tx.insert(osHistorico).values({
        osId: data.id,
        acao: 'reagendamento',
        statusNovo: 'reagendada',
        motivo: data.data.motivoReagendamento,
        detalhes: `Reagendado para ${data.data.novaDataAgendada}`,
      })

      return osAtualizada
    })
  })

export const cancelarOrdemServico = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.number(), data: osCancelamentoSchema }))
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      // Verificar status atual da OS
      const osAtual = await tx
        .select()
        .from(ordensServico)
        .where(eq(ordensServico.id, data.id))
        .then((res) => res[0])

      if (!osAtual) {
        throw new Error('Ordem de Serviço não encontrada')
      }

      const auth = await requireTecnicoOrAdmin()
      if (auth.userType === 'tecnico' && osAtual.tecnicoId !== auth.userId) {
        throw new Error('Acesso negado')
      }

      if (osAtual.status === 'concluida') {
        throw new Error('Não é possível cancelar uma OS concluída')
      }

      const [osAtualizada] = await tx
        .update(ordensServico)
        .set({
          status: 'cancelada',
          motivoCancelamento: data.data.motivoCancelamento,
          dataCancelamento: new Date(),
        })
        .where(eq(ordensServico.id, data.id))
        .returning()

      await tx.insert(osHistorico).values({
        osId: data.id,
        acao: 'cancelamento',
        statusNovo: 'cancelada',
        motivo: data.data.motivoCancelamento,
        detalhes: data.data.observacoes || 'Cancelado sem observações',
      })

      return osAtualizada
    })
  })

export const updateOrdemServico = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.number(), data: osSchema }))
  .handler(async ({ data }) => {
    const status = data.data.dataAgendada ? 'agendada' : data.data.status

    const [atualizada] = await db
      .update(ordensServico)
      .set({
        clienteId: data.data.clienteId,
        tipoServico: data.data.tipoServico,
        descricaoProblema: data.data.descricaoProblema,
        observacoes: data.data.observacoes,
        prioridade: data.data.prioridade,
        dataAgendada: data.data.dataAgendada
          ? new Date(data.data.dataAgendada)
          : null,
        tecnicoId: data.data.tecnicoId,
        valor: data.data.valor || null,
        status: status,
      })
      .where(eq(ordensServico.id, data.id))
      .returning()
    return atualizada
  })

export const deleteOrdemServico = createServerFn({ method: 'POST' })
  .validator(z.number())
  .handler(async ({ data }) => {
    await db.delete(ordensServico).where(eq(ordensServico.id, data))
    return { success: true }
  })

export const iniciarAtendimento = createServerFn({ method: 'POST' })
  .validator(z.number())
  .handler(async ({ data }) => {
    return await db.transaction(async (tx) => {
      const osAtual = await tx
        .select()
        .from(ordensServico)
        .where(eq(ordensServico.id, data))
        .then((res) => res[0])

      if (!osAtual) throw new Error('OS não encontrada')

      const auth = await requireTecnicoOrAdmin()
      if (auth.userType === 'tecnico' && osAtual.tecnicoId !== auth.userId) {
        throw new Error('Acesso negado')
      }

      const [osAtualizada] = await tx
        .update(ordensServico)
        .set({
          status: 'em_execucao',
        })
        .where(eq(ordensServico.id, data))
        .returning()

      await tx.insert(osHistorico).values({
        osId: data,
        acao: 'atualizacao',
        statusNovo: 'em_execucao',
        detalhes: 'Atendimento iniciado',
      })

      return osAtualizada
    })
  })

/* ── Speed Test Endpoints ── */

export const salvarSpeedTestOs = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      id: z.number(),
      speedTestPing: z.number(),
      speedTestDownload: z.number(),
      speedTestUpload: z.number(),
      speedTestDataHora: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const auth = await requireTecnicoOrAdmin()

    const osAtual = await db.query.ordensServico.findFirst({
      where: eq(ordensServico.id, data.id),
    })

    if (!osAtual) {
      throw new Error('Ordem de Serviço não encontrada')
    }

    if (auth.userType === 'tecnico' && osAtual.tecnicoId !== auth.userId) {
      throw new Error('Acesso negado')
    }

    if (osAtual.status === 'cancelada') {
      throw new Error('Não é possível salvar teste em OS cancelada')
    }

    const [atualizada] = await db
      .update(ordensServico)
      .set({
        speedTestPing: String(data.speedTestPing),
        speedTestDownload: String(data.speedTestDownload),
        speedTestUpload: String(data.speedTestUpload),
        speedTestDataHora: new Date(data.speedTestDataHora),
      })
      .where(eq(ordensServico.id, data.id))
      .returning()

    return atualizada
  })

export const speedTestPing = createServerFn({ method: 'GET' }).handler(
  async () => {
    return { ok: true }
  },
)

export const speedTestDownload = createServerFn({ method: 'GET' }).handler(
  async () => {
    // Returns exactly 10MB of string data
    return { data: '0'.repeat(10 * 1024 * 1024) }
  },
)

export const speedTestUpload = createServerFn({ method: 'POST' })
  .validator(z.object({ payload: z.string() }))
  .handler(async () => {
    return { ok: true }
  })
