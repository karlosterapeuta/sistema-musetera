'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'
import { useRouter } from 'next/navigation'
import jsPDF from 'jspdf'

// Definição das áreas da escala DEMUCA
const AREAS_AVALIACAO = {
  musicalidade: {
    titulo: 'Musicalidade',
    itens: [
      'Percepção Rítmica',
      'Percepção Melódica',
      'Expressão Musical',
      'Coordenação Sonoro-Motora',
      'Atenção Musical'
    ]
  },
  comunicacao: {
    titulo: 'Comunicação',
    itens: [
      'Comunicação Verbal',
      'Comunicação Não-Verbal',
      'Interação Musical',
      'Expressão Vocal',
      'Compreensão de Comandos'
    ]
  },
  interacaoSocial: {
    titulo: 'Interação Social',
    itens: [
      'Contato Visual',
      'Atenção Compartilhada',
      'Participação em Grupo',
      'Reciprocidade Social',
      'Imitação'
    ]
  },
  comportamento: {
    titulo: 'Comportamento',
    itens: [
      'Estereotipias',
      'Autorregulação',
      'Flexibilidade',
      'Interesse Musical',
      'Comportamento Adaptativo'
    ]
  }
}

// Escala de pontuação
const ESCALA_PONTUACAO = [
  { valor: 1, descricao: 'Ausente/Muito Baixo' },
  { valor: 2, descricao: 'Baixo/Emergente' },
  { valor: 3, descricao: 'Moderado' },
  { valor: 4, descricao: 'Adequado' },
  { valor: 5, descricao: 'Excelente' }
]

export default function EscalaTEA() {
  const router = useRouter()
  
  // Estado para os dados do formulário com valores preenchidos
  const [formData, setFormData] = useState({
    // Informações Básicas
    data: new Date().toISOString().split('T')[0],
    horario: new Date().toLocaleTimeString().slice(0, 5),
    
    // Dados do Paciente
    paciente: 'João Silva',
    dataNascimento: '2015-05-15',
    idade: '8',
    responsavel: 'Maria Silva',
    
    // Pontuações (exemplo preenchido)
    pontuacoes: {
      musicalidade: {
        'Percepção Rítmica': 3,
        'Percepção Melódica': 2,
        'Expressão Musical': 3,
        'Coordenação Sonoro-Motora': 2,
        'Atenção Musical': 3
      },
      comunicacao: {
        'Comunicação Verbal': 2,
        'Comunicação Não-Verbal': 3,
        'Interação Musical': 3,
        'Expressão Vocal': 2,
        'Compreensão de Comandos': 3
      },
      interacaoSocial: {
        'Contato Visual': 2,
        'Atenção Compartilhada': 2,
        'Participação em Grupo': 2,
        'Reciprocidade Social': 2,
        'Imitação': 3
      },
      comportamento: {
        'Estereotipias': 2,
        'Autorregulação': 2,
        'Flexibilidade': 2,
        'Interesse Musical': 4,
        'Comportamento Adaptativo': 3
      }
    },
    
    // Observações por área
    observacoes: {
      musicalidade: '- Demonstra interesse por ritmos simples e repetitivos\n- Responde bem a melodias familiares\n- Coordenação em desenvolvimento\n- Mantém atenção por períodos curtos\n- Explora instrumentos com curiosidade',
      comunicacao: '- Vocabulário limitado mas funcional\n- Usa gestos para se comunicar\n- Responde a chamados musicais\n- Vocaliza durante atividades preferidas\n- Compreende comandos simples',
      interacaoSocial: '- Contato visual breve mas presente\n- Compartilha alguns momentos musicais\n- Prefere atividades individuais\n- Interage quando motivado\n- Imita gestos simples',
      comportamento: '- Apresenta algumas estereotipias motoras\n- Busca música para autorregulação\n- Aceita mudanças graduais na rotina\n- Demonstra prazer em atividades musicais\n- Adapta-se bem ao setting terapêutico'
    },
    
    // Conclusões e Recomendações
    conclusaoGeral: 'O paciente demonstra potencial significativo para intervenção musicoterapêutica. Apresenta respostas positivas a estímulos musicais, especialmente rítmicos, e utiliza a música como meio de autorregulação. As áreas de maior necessidade são comunicação e interação social, onde a música pode ser uma ferramenta valiosa de desenvolvimento.',
    
    recomendacoes: '1. Sessões semanais de musicoterapia\n2. Foco inicial em atividades rítmicas e de atenção compartilhada\n3. Uso de instrumentos de percussão e canções estruturadas\n4. Gradual introdução de atividades em pequenos grupos\n5. Envolvimento familiar no processo terapêutico',
    
    planejamentoTerapeutico: '- Início com sessões individuais de 45 minutos\n- Utilização de instrumentos de interesse do paciente\n- Atividades focadas em comunicação e interação\n- Trabalho com músicas preferidas e familiares\n- Reavaliação após 3 meses de intervenção'
  })

  // Estado para os dados do profissional
  const [profissional, setProfissional] = useState({
    nome: '',
    registro: ''
  })

  // Carrega os dados do profissional do localStorage
  useEffect(() => {
    const savedProfessional = localStorage.getItem('professional')
    if (savedProfessional) {
      const data = JSON.parse(savedProfessional)
      setProfissional({
        nome: data.nome || '',
        registro: data.registro || ''
      })
    }
  }, [])

  // Manipulador de mudanças nos campos
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Manipulador de mudanças nas pontuações
  const handlePontuacaoChange = (area: string, item: string, valor: number) => {
    setFormData(prev => ({
      ...prev,
      pontuacoes: {
        ...prev.pontuacoes,
        [area]: {
          ...prev.pontuacoes[area],
          [item]: valor
        }
      }
    }))
  }

  // Manipulador de mudanças nas observações
  const handleObservacaoChange = (area: string, valor: string) => {
    setFormData(prev => ({
      ...prev,
      observacoes: {
        ...prev.observacoes,
        [area]: valor
      }
    }))
  }

  // Função para calcular média de uma área
  const calcularMediaArea = (area: string) => {
    const pontuacoes = Object.values(formData.pontuacoes[area])
    const soma = pontuacoes.reduce((acc, curr) => acc + curr, 0)
    return (soma / pontuacoes.length).toFixed(1)
  }

  // Função para gerar o PDF
  const generatePDF = () => {
    const doc = new jsPDF()
    let yPos = 20

    // Título
    doc.setFontSize(16)
    doc.text('Escala DEMUCA - Avaliação TEA', 105, yPos, { align: 'center' })
    yPos += 15

    // Informações básicas
    doc.setFontSize(12)
    doc.text(`Data: ${formData.data}    Horário: ${formData.horario}`, 20, yPos)
    yPos += 10

    // Dados do paciente
    doc.text(`Paciente: ${formData.paciente}`, 20, yPos)
    yPos += 7
    doc.text(`Data de Nascimento: ${formData.dataNascimento}    Idade: ${formData.idade}`, 20, yPos)
    yPos += 7
    doc.text(`Responsável: ${formData.responsavel}`, 20, yPos)
    yPos += 15

    // Função auxiliar para adicionar seções
    const addSection = (title: string, content: string) => {
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(title, 20, yPos)
      yPos += 7
      doc.setFont('helvetica', 'normal')
      doc.text(content, 30, yPos, { maxWidth: 150 })
      yPos += doc.getTextDimensions(content, { maxWidth: 150 }).h + 10
    }

    // Adiciona resultados por área
    Object.keys(AREAS_AVALIACAO).forEach(area => {
      const areaTitle = AREAS_AVALIACAO[area].titulo
      const pontuacoes = AREAS_AVALIACAO[area].itens.map(item => 
        `${item}: ${formData.pontuacoes[area][item]}`
      ).join('\n')
      
      addSection(`${areaTitle} (Média: ${calcularMediaArea(area)})`, pontuacoes)
      addSection(`Observações - ${areaTitle}`, formData.observacoes[area])
    })

    // Adiciona conclusões e recomendações
    addSection('Conclusão Geral', formData.conclusaoGeral)
    addSection('Recomendações', formData.recomendacoes)
    addSection('Planejamento Terapêutico', formData.planejamentoTerapeutico)

    // Adiciona assinatura do profissional
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }
    yPos += 10
    doc.text('_'.repeat(50), 65, yPos, { align: 'center' })
    yPos += 5
    doc.text(profissional.nome, 105, yPos, { align: 'center' })
    yPos += 5
    doc.text(`Musicoterapeuta - MT ${profissional.registro}`, 105, yPos, { align: 'center' })

    // Salva o PDF
    doc.save(`Escala_DEMUCA_${formData.data.replace(/\//g, '-')}_${formData.paciente}.pdf`)
  }

  return (
    <div className="container mx-auto p-2 sm:p-4 md:p-8">
      <Card className="p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Escala DEMUCA - Avaliação TEA</h1>

        <form className="space-y-4 sm:space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="w-full">
              <Label className="text-sm sm:text-base">Data</Label>
              <Input
                type="date"
                value={formData.data}
                onChange={(e) => handleInputChange('data', e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full">
              <Label className="text-sm sm:text-base">Horário</Label>
              <Input
                type="time"
                value={formData.horario}
                onChange={(e) => handleInputChange('horario', e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Dados do Paciente */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="w-full">
              <Label className="text-sm sm:text-base">Nome do Paciente</Label>
              <Input
                value={formData.paciente}
                onChange={(e) => handleInputChange('paciente', e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full">
              <Label className="text-sm sm:text-base">Data de Nascimento</Label>
              <Input
                type="date"
                value={formData.dataNascimento}
                onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full">
              <Label className="text-sm sm:text-base">Idade</Label>
              <Input
                value={formData.idade}
                onChange={(e) => handleInputChange('idade', e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full">
              <Label className="text-sm sm:text-base">Responsável</Label>
              <Input
                value={formData.responsavel}
                onChange={(e) => handleInputChange('responsavel', e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Áreas de Avaliação */}
          {Object.entries(AREAS_AVALIACAO).map(([areaKey, area]) => (
            <div key={areaKey} className="space-y-3 sm:space-y-4 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg sm:text-xl font-semibold flex flex-col sm:flex-row sm:items-center gap-2">
                {area.titulo}
                <span className="text-sm font-normal text-gray-600">
                  (Média: {calcularMediaArea(areaKey)})
                </span>
              </h2>
              
              {/* Pontuações */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {area.itens.map(item => (
                  <div key={item} className="space-y-1">
                    <Label className="text-sm sm:text-base">{item}</Label>
                    <select
                      className="w-full p-2 border rounded text-sm sm:text-base bg-white"
                      value={formData.pontuacoes[areaKey][item]}
                      onChange={(e) => handlePontuacaoChange(areaKey, item, Number(e.target.value))}
                    >
                      {ESCALA_PONTUACAO.map(opcao => (
                        <option key={opcao.valor} value={opcao.valor}>
                          {opcao.valor} - {opcao.descricao}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Observações da área */}
              <div className="w-full">
                <Label className="text-sm sm:text-base">Observações - {area.titulo}</Label>
                <Textarea
                  value={formData.observacoes[areaKey]}
                  onChange={(e) => handleObservacaoChange(areaKey, e.target.value)}
                  rows={4}
                  className="w-full min-h-[100px] text-sm sm:text-base mt-1"
                />
              </div>
            </div>
          ))}

          {/* Conclusões e Recomendações */}
          <div className="space-y-3 sm:space-y-4">
            {[
              { label: 'Conclusão Geral', field: 'conclusaoGeral' },
              { label: 'Recomendações', field: 'recomendacoes' },
              { label: 'Planejamento Terapêutico', field: 'planejamentoTerapeutico' }
            ].map(({ label, field }) => (
              <div key={field} className="w-full">
                <Label className="text-sm sm:text-base">{label}</Label>
                <Textarea
                  value={formData[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  rows={4}
                  className="w-full min-h-[100px] text-sm sm:text-base mt-1"
                />
              </div>
            ))}
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={generatePDF}
              className="w-full sm:w-auto"
            >
              Gerar PDF
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
