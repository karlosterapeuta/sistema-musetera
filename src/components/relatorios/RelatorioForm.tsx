'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { PatientSelect } from '../processos/PatientSelect'
import { Patient } from '@/types'
import { PDFExport } from '@progress/kendo-react-pdf'
import { formatarData } from '@/utils/formatters'
import { RelatorioPDF } from './RelatorioPDF'
import jsPDF from 'jspdf';

const TIPOS_RELATORIO = [
  { id: 'sessao', label: 'Relatório de Sessão' },
  { id: 'evolucao_mensal', label: 'Relatório de Evolução Mensal' },
  { id: 'evolucao_semestral', label: 'Relatório de Evolução Semestral' },
  { id: 'avaliacao', label: 'Relatório de Avaliação' },
  { id: 'alta', label: 'Relatório de Alta' },
  { id: 'familia', label: 'Relatório para Família' },
  { id: 'equipe', label: 'Relatório para Equipe' }
]

// Campos específicos por tipo de relatório
const CAMPOS_ESPECIFICOS = {
  sessao: [
    {
      titulo: 'Dados da Sessão Terapêutica',
      campos: [
        { id: 'data', label: 'Data', tipo: 'date' },
        { id: 'horario', label: 'Horário', tipo: 'time' },
        { id: 'numeroSessao', label: 'Número da Sessão', tipo: 'number' },
        { id: 'duracao', label: 'Duração (minutos)', tipo: 'number' },
        { id: 'setting', label: 'Setting Terapêutico', tipo: 'select',
          opcoes: [
            'Consultório',
            'Domiciliar',
            'Institucional',
            'Ambiente Virtual',
            'Outro'
          ]
        }
      ]
    },
    {
      titulo: 'Planejamento Terapêutico',
      campos: [
        { 
          id: 'objetivosSessao', 
          label: 'Objetivos Específicos da Sessão', 
          tipo: 'multiselect',
          opcoes: [
            'Desenvolvimento de habilidades pragmáticas da comunicação',
            'Promoção da interação social recíproca',
            'Facilitação da expressão e regulação emocional',
            'Desenvolvimento psicomotor integrado',
            'Estimulação das funções executivas',
            'Desenvolvimento da percepção e processamento auditivo',
            'Integração sensorial através de estímulos sonoro-musicais',
            'Desenvolvimento de estratégias de autorregulação'
          ]
        }
      ]
    },
    {
      titulo: 'Descrição das Intervenções Musicoterapêuticas',
      campos: [
        {
          id: 'metodologiasAplicadas',
          label: 'Metodologias Aplicadas',
          tipo: 'multiselect',
          opcoes: [
            'Improvisação Clínica (Modelo Nordoff-Robbins)',
            'Re-criação Musical Terapêutica',
            'Composição Musical Direcionada',
            'Audição Musical Receptiva (GIM adaptado)',
            'Técnicas de Musicoterapia Neurológica (NMT)',
            'Método STAM (Sons e Transcendência)',
            'Técnicas de ISO e Entrainment',
            'Abordagem Plurimodal em Musicoterapia'
          ]
        },
        {
          id: 'instrumentosUtilizados',
          label: 'Recursos Sonoro-Musicais',
          tipo: 'multiselect',
          opcoes: [
            'Instrumentos de Percussão (especificar)',
            'Instrumentos Melódicos (especificar)',
            'Instrumentos Harmônicos (especificar)',
            'Recursos Tecnológicos/DAW',
            'Voz e Corpo',
            'Material Sonoro Gravado',
            'Instrumentos Adaptados',
            'Recursos Auxiliares'
          ]
        },
        {
          id: 'descricaoIntervencoes',
          label: 'Descrição Detalhada das Intervenções',
          tipo: 'textarea',
          placeholder: 'Descreva a sequência e desenvolvimento das intervenções realizadas, incluindo adaptações necessárias e progressão das atividades.'
        }
      ]
    },
    {
      titulo: 'Resposta do Paciente',
      campos: [
        {
          id: 'respostaMusical',
          label: 'Resposta Musical',
          tipo: 'multiselect',
          opcoes: [
            'Demonstrou engajamento musical ativo',
            'Apresentou iniciativas sonoro-musicais',
            'Manteve sincronia rítmica',
            'Explorou variações melódicas',
            'Respondeu a mudanças dinâmicas',
            'Demonstrou preferências musicais',
            'Estabeleceu diálogo sonoro-musical',
            'Apresentou expressividade musical'
          ]
        },
        {
          id: 'respostaComportamental',
          label: 'Aspectos Comportamentais',
          tipo: 'multiselect',
          opcoes: [
            'Manteve engajamento nas propostas terapêuticas',
            'Demonstrou regulação sensorial adequada',
            'Apresentou reciprocidade socioemocional',
            'Manteve atenção sustentada',
            'Demonstrou compreensão das consignas',
            'Apresentou comportamento colaborativo',
            'Manifestou adequação postural',
            'Demonstrou autorregulação emocional'
          ]
        },
        {
          id: 'descricaoRespostas',
          label: 'Análise das Respostas',
          tipo: 'textarea',
          placeholder: 'Descreva detalhadamente as respostas observadas, incluindo padrões comportamentais, mudanças significativas e aspectos relevantes da interação terapêutica.'
        }
      ]
    },
    {
      titulo: 'Avaliação Técnica',
      campos: [
        {
          id: 'avaliacaoObjetivos',
          label: 'Análise dos Objetivos',
          tipo: 'multiselect',
          opcoes: [
            'Objetivos totalmente alcançados',
            'Objetivos parcialmente alcançados',
            'Objetivos em desenvolvimento',
            'Necessidade de reformulação',
            'Identificação de novos objetivos',
            'Manutenção do planejamento atual'
          ]
        },
        {
          id: 'avaliacaoTecnica',
          label: 'Parecer Técnico',
          tipo: 'textarea',
          placeholder: 'Apresente sua análise técnica sobre a eficácia das intervenções, progressos observados e fundamentação teórica pertinente.'
        }
      ]
    },
    {
      titulo: 'Planejamento Futuro',
      campos: [
        {
          id: 'planejamentoFuturo',
          label: 'Direcionamentos Terapêuticos',
          tipo: 'multiselect',
          opcoes: [
            'Manutenção das estratégias atuais',
            'Adaptação das intervenções',
            'Introdução de novas técnicas',
            'Ajuste dos objetivos terapêuticos',
            'Necessidade de avaliação específica',
            'Indicação para abordagem interdisciplinar'
          ]
        },
        {
          id: 'observacoesAdicionais',
          label: 'Observações Complementares',
          tipo: 'textarea',
          placeholder: 'Registre informações adicionais relevantes, intercorrências ou observações específicas que contribuam para o processo terapêutico.'
        }
      ]
    }
  ],

  evolucao_mensal: [
    {
      titulo: 'Análise da Evolução Terapêutica',
      campos: [
        {
          id: 'evolucaoMusical',
          label: 'Desenvolvimento Sonoro-Musical',
          tipo: 'multiselect',
          opcoes: [
            'Aprimoramento da percepção e discriminação rítmica',
            'Desenvolvimento da expressão vocal e melódica',
            'Expansão do repertório sonoro-musical',
            'Ampliação do engajamento instrumental',
            'Desenvolvimento da criatividade e expressão musical',
            'Aprimoramento da coordenação neuromotora',
            'Desenvolvimento das habilidades de improvisação clínica'
          ]
        },
        {
          id: 'evolucaoComportamental',
          label: 'Desenvolvimento Comportamental',
          tipo: 'multiselect',
          opcoes: [
            'Redução significativa de comportamentos disfuncionais',
            'Aprimoramento da regulação emocional',
            'Aumento do limiar de tolerância à frustração',
            'Ampliação do período de sustentação da atenção',
            'Melhora na organização e planejamento comportamental',
            'Desenvolvimento da flexibilidade cognitiva',
            'Redução dos níveis de ansiedade'
          ]
        }
      ]
    },
    {
      titulo: 'Avaliação dos Objetivos Terapêuticos',
      campos: [
        {
          id: 'objetivosAlcancados',
          label: 'Objetivos Alcançados',
          tipo: 'multiselect',
          opcoes: [
            'Desenvolvimento significativo da comunicação pragmática',
            'Ampliação das habilidades sociointeracionais',
            'Desenvolvimento das competências musicais terapêuticas',
            'Aprimoramento da expressão e regulação emocional',
            'Desenvolvimento da autonomia funcional',
            'Evolução do desenvolvimento neuropsicomotor',
            'Estabelecimento de estratégias de autorregulação'
          ]
        }
      ]
    }
  ],

  alta: [
    {
      titulo: 'Critérios de Alta Terapêutica',
      campos: [
        {
          id: 'motivosAlta',
          label: 'Justificativa Clínica',
          tipo: 'multiselect',
          opcoes: [
            'Consecução dos objetivos terapêuticos estabelecidos',
            'Desenvolvimento satisfatório das habilidades-alvo',
            'Estabilização do quadro comportamental e emocional',
            'Desenvolvimento da autonomia nas intervenções propostas',
            'Generalização das habilidades adquiridas',
            'Indicação para outras modalidades terapêuticas complementares'
          ]
        }
      ]
    },
    {
      titulo: 'Orientações Terapêuticas',
      campos: [
        {
          id: 'recomendacoes',
          label: 'Recomendações Técnicas',
          tipo: 'multiselect',
          opcoes: [
            'Manutenção das atividades musicoterapêuticas em ambiente domiciliar',
            'Continuidade da estimulação sonoro-musical',
            'Participação em atividades musicais socializantes',
            'Acompanhamento periódico para monitoramento',
            'Integração com outras abordagens terapêuticas',
            'Manutenção do suporte familiar nas atividades propostas'
          ]
        }
      ]
    }
  ]
}

// Campos comuns a todos os tipos de relatório
const CAMPOS_COMUNS = [
  {
    titulo: 'Conclusões',
    campos: [
      {
        id: 'evolucao',
        label: 'Evolução Observada',
        tipo: 'textarea',
        placeholder: 'Descreva a evolução observada...'
      },
      {
        id: 'dificuldades',
        label: 'Dificuldades Encontradas',
        tipo: 'textarea',
        placeholder: 'Descreva as dificuldades observadas...'
      },
      {
        id: 'recomendacoes',
        label: 'Recomendações',
        tipo: 'textarea',
        placeholder: 'Insira as recomendações e orientações...'
      },
      {
        id: 'observacoes',
        label: 'Observações Adicionais',
        tipo: 'textarea',
        placeholder: 'Outras observações relevantes...'
      }
    ]
  }
];

const CONCLUSOES_ESPECIFICAS = {
  sessao: {
    evolucao: [
      'Paciente demonstrou progresso significativo na interação musical, evidenciado por',
      'Observou-se melhora na comunicação verbal durante as atividades musicais, caracterizada por',
      'Apresentou evolução na coordenação motora e expressão rítmica, manifestada através de',
      'Houve avanço na regulação emocional durante as intervenções musicais, demonstrado por',
      'Notou-se desenvolvimento na capacidade de atenção sustentada, especialmente durante',
      'Evidenciou progresso na interação social durante as atividades em grupo, expresso por'
    ],
    dificuldades: [
      'Apresentou dificuldade na manutenção do foco atencional durante',
      'Demonstrou resistência em participar de atividades que envolvem',
      'Observou-se limitação na coordenação motora para',
      'Manifestou desorganização comportamental quando',
      'Apresentou dificuldade em seguir comandos relacionados a'
    ],
    recomendacoes: [
      'Sugere-se a continuidade do trabalho com ênfase em',
      'Recomenda-se intensificar as atividades voltadas para',
      'Indica-se a manutenção das intervenções focadas em',
      'Propõe-se adaptação das atividades para melhor atender',
      'Orienta-se o desenvolvimento de estratégias específicas para'
    ]
  },
  evolucao_mensal: {
    evolucao: [
      'Durante o período observou-se consistente evolução em aspectos como',
      'O desenvolvimento das habilidades musicais demonstrou progresso em',
      'Houve significativa melhora nos padrões comportamentais, especialmente em',
      'A evolução na comunicação foi evidenciada através de',
      'O progresso na interação social manifestou-se por meio de'
    ],
    dificuldades: [
      'Persistem desafios significativos em relação a',
      'Identificou-se necessidade de maior suporte em',
      'As principais barreiras observadas relacionam-se a',
      'Requer atenção específica o desenvolvimento de'
    ],
    recomendacoes: [
      'Recomenda-se a intensificação do trabalho terapêutico em',
      'Sugere-se a implementação de novas estratégias para',
      'Indica-se a manutenção das intervenções focadas em',
      'Propõe-se reavaliação dos objetivos relacionados a'
    ]
  },
  alta: {
    evolucao: [
      'Ao longo do processo terapêutico, observou-se significativa evolução em',
      'O desenvolvimento global demonstrou progressos consistentes em',
      'Atingiu-se os objetivos terapêuticos propostos, especialmente em',
      'Houve generalização das habilidades adquiridas para'
    ],
    dificuldades: [
      'Os desafios remanescentes concentram-se em',
      'Aspectos que podem beneficiar-se de acompanhamento continuado:',
      'Áreas que requerem monitoramento posterior:',
      'Pontos de atenção para acompanhamento futuro:'
    ],
    recomendacoes: [
      'Recomenda-se manutenção de atividades musicais em ambiente',
      'Sugere-se acompanhamento periódico para monitoramento de',
      'Indica-se reavaliação em [período] para verificação de',
      'Orienta-se a família quanto à continuidade de'
    ]
  }
};

export function RelatorioForm({ onSubmit, initialData }: { onSubmit: (data: any) => void, initialData?: any }) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [formData, setFormData] = useState(initialData || {})
  const [tipoRelatorio, setTipoRelatorio] = useState('')

  const handleInputChange = (secao: string, campo: string, valor: any) => {
    setFormData(prev => ({
      ...prev,
      [secao]: {
        ...prev[secao],
        [campo]: valor
      }
    }))
  }

  const handleExportPDF = () => {
    if (!selectedPatient || !tipoRelatorio || !formData) return;
    
    const doc = new jsPDF();
    let yPos = 20;

    // Configurações de fonte e tamanho
    doc.setFont('helvetica');
    
    // Título
    const tituloRelatorio = TIPOS_RELATORIO.find(t => t.id === tipoRelatorio)?.label || tipoRelatorio;
    doc.setFontSize(18);
    doc.text(tituloRelatorio, doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' });
    yPos += 15;

    // Data
    doc.setFontSize(12);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' });
    yPos += 20;

    // Dados do Paciente
    doc.setFontSize(14);
    doc.text('Dados do Paciente', 20, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.text(`Nome: ${selectedPatient.name}`, 20, yPos);
    yPos += 7;
    doc.text(`Data de Nascimento: ${new Date(selectedPatient.dateOfBirth).toLocaleDateString('pt-BR')}`, 20, yPos);
    yPos += 15;

    // Conteúdo do Relatório
    Object.entries(formData).forEach(([secao, campos]: [string, any]) => {
      if (typeof campos === 'object' && campos !== null) {
        // Verifica se precisa adicionar nova página
        if (yPos > doc.internal.pageSize.getHeight() - 40) {
          doc.addPage();
          yPos = 20;
        }

        // Título da seção
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(secao, 20, yPos);
        yPos += 10;

        // Campos da seção
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        Object.entries(campos).forEach(([campo, valor]: [string, any]) => {
          if (valor) {
            // Verifica se precisa adicionar nova página
            if (yPos > doc.internal.pageSize.getHeight() - 20) {
              doc.addPage();
              yPos = 20;
            }

            // Se for array, junta os itens com vírgula
            const textoValor = Array.isArray(valor) ? valor.join(', ') : valor.toString();
            
            // Quebra o texto em linhas se for muito longo
            const linhas = doc.splitTextToSize(textoValor, doc.internal.pageSize.getWidth() - 40);
            
            doc.setFont('helvetica', 'bold');
            doc.text(`${campo}: `, 20, yPos);
            
            // Calcula a largura do label para posicionar o valor
            const labelWidth = doc.getTextWidth(`${campo}: `);
            
            doc.setFont('helvetica', 'normal');
            linhas.forEach((linha: string, index: number) => {
              if (index === 0) {
                doc.text(linha, 20 + labelWidth, yPos);
              } else {
                yPos += 7;
                doc.text(linha, 20, yPos);
              }
            });
            
            yPos += 10;
          }
        });
        yPos += 5;
      }
    });

    // Assinatura
    if (yPos > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      yPos = 20;
    }

    yPos += 20;
    doc.setFont('helvetica', 'normal');
    doc.text('_'.repeat(50), doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' });
    yPos += 7;
    doc.text('Assinatura do Musicoterapeuta', doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' });
    yPos += 7;
    doc.text('CRM/CREFITO', doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' });

    // Salva o PDF
    const nomeArquivo = `${tipoRelatorio.toLowerCase()}_${selectedPatient.name.toLowerCase().replace(/\s+/g, '_')}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '_')}.pdf`;
    doc.save(nomeArquivo);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPatient) return

    const relatorioData = {
      tipo: tipoRelatorio,
      patientId: selectedPatient.id,
      data: new Date(),
      conteudo: formData,
      status: 'finalizado'
    }

    onSubmit(relatorioData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <div className="p-6 space-y-4">
          <PatientSelect
            onSelect={setSelectedPatient}
            selectedId={selectedPatient?.id}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Relatório
            </label>
            <select
              className="w-full p-2 border rounded-lg"
              value={tipoRelatorio}
              onChange={(e) => setTipoRelatorio(e.target.value)}
              required
            >
              <option value="">Selecione o tipo de relatório...</option>
              {TIPOS_RELATORIO.map(tipo => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {selectedPatient && tipoRelatorio && (
        <>
          {CAMPOS_COMUNS.map((secao, index) => (
            <Card key={index}>
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">{secao.titulo}</h3>
                <div className="space-y-4">
                  {secao.campos.map((campo) => (
                    <div key={campo.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {campo.label}
                      </label>
                      {renderCampo(campo, formData[secao.titulo] || {}, (valor) => 
                        handleInputChange(secao.titulo, campo.id, valor),
                        tipoRelatorio
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleExportPDF}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Exportar PDF
            </button>
          </div>
        </>
      )}
    </form>
  )
}

function renderCampo(campo: any, formData: any, onChange: (valor: any) => void, tipoRelatorio?: string) {
  if (campo.tipo === 'textarea' && tipoRelatorio && CONCLUSOES_ESPECIFICAS[tipoRelatorio as keyof typeof CONCLUSOES_ESPECIFICAS]) {
    const sugestoes = CONCLUSOES_ESPECIFICAS[tipoRelatorio as keyof typeof CONCLUSOES_ESPECIFICAS][campo.id as keyof typeof CONCLUSOES_ESPECIFICAS[keyof typeof CONCLUSOES_ESPECIFICAS]]
    
    return (
      <div className="space-y-2">
        <textarea
          className="w-full p-2 border rounded-lg"
          rows={4}
          value={formData[campo.id] || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={campo.placeholder}
        />
        {sugestoes && (
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-700 mb-1">Sugestões de texto:</p>
            <div className="space-y-1">
              {sugestoes.map((sugestao: string, index: number) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onChange(formData[campo.id] ? `${formData[campo.id]}\n${sugestao}` : sugestao)}
                  className="text-sm text-indigo-600 hover:text-indigo-800 block"
                >
                  + {sugestao}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
  
  switch (campo.tipo) {
    case 'text':
      return (
        <input
          type="text"
          className="w-full p-2 border rounded-lg"
          value={formData[campo.id] || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={campo.placeholder}
        />
      )
    case 'textarea':
      return (
        <textarea
          className="w-full p-2 border rounded-lg"
          rows={4}
          value={formData[campo.id] || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={campo.placeholder}
        />
      )
    case 'select':
      return (
        <select
          className="w-full p-2 border rounded-lg"
          value={formData[campo.id] || ''}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Selecione...</option>
          {campo.opcoes?.map((opcao: any) => (
            <option key={opcao.id || opcao} value={opcao.id || opcao}>
              {opcao.label || opcao}
            </option>
          ))}
        </select>
      )
    default:
      return null
  }
}