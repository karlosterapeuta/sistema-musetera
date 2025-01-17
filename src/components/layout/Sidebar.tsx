'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidebar } from '@/contexts/SidebarContext'

const navigation = [
  {
    name: 'Pacientes',
    href: '/pacientes',
    icon: UserGroupIcon,
    children: [
      { name: 'Lista de Pacientes', href: '/pacientes' },
      { name: 'Novo Paciente', href: '/pacientes/novo' }
    ]
  },
  {
    name: 'Processos',
    icon: ClipboardDocumentListIcon,
    children: [
      { name: 'Anamnese', href: '/processos/anamnese' },
      { name: 'Avaliação', href: '/processos/avaliacao' },
      { name: 'Plano Terapêutico', href: '/processos/plano' },
      { name: 'Intervenções', href: '/processos/intervencoes' },
      { name: 'Reavaliação', href: '/processos/reavaliacao' },
      { name: 'Relatório', href: '/relatorios/novo' }
    ]
  },
  {
    name: 'Relatórios',
    href: '/relatorios',
    icon: DocumentTextIcon,
    children: [
      { name: 'Lista de Relatórios', href: '/relatorios/lista' },
      { name: 'Relatório de Sessão', href: '/relatorios/novo?tipo=sessao' },
      { name: 'Relatório Mensal', href: '/relatorios/novo?tipo=mensal' },
      { name: 'Relatório Semestral', href: '/relatorios/novo?tipo=semestral' },
      { name: 'Relatório para Família', href: '/relatorios/novo?tipo=familia' },
      { name: 'Relatório para Equipe', href: '/relatorios/novo?tipo=equipe' }
    ]
  }
]

export function Sidebar() {
  const { isOpen, toggle, close } = useSidebar()
  const pathname = usePathname()

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const getItemClass = (isActiveItem: boolean) => {
    return `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
      isActiveItem
        ? 'bg-gray-50 text-indigo-600'
        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
    }`
  }

  const getIconClass = (isActiveItem: boolean) => {
    return `h-6 w-6 shrink-0 ${
      isActiveItem
        ? 'text-indigo-600'
        : 'text-gray-400 group-hover:text-indigo-600'
    }`
  }

  const getChildClass = (isActiveItem: boolean) => {
    return `block rounded-md py-2 pr-2 pl-9 text-sm leading-6 ${
      isActiveItem
        ? 'bg-gray-50 text-indigo-600'
        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
    }`
  }

  return (
    <>
      {/* Menu móvel overlay */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="fixed inset-0 z-50 lg:hidden" 
          onClose={close}
        >
          {/* Fundo escuro */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          {/* Menu lateral móvel */}
          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-4 sm:px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center justify-between">
                    <h1 className="text-lg sm:text-xl font-semibold text-indigo-600">MuseTera</h1>
                    <button 
                      onClick={close}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-4 sm:gap-y-7">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          {item.href ? (
                            <Link
                              href={item.href}
                              className={getItemClass(isActive(item.href))}
                              onClick={close}
                            >
                              <item.icon
                                className={getIconClass(isActive(item.href))}
                                aria-hidden="true"
                              />
                              <span className="text-xs sm:text-sm">{item.name}</span>
                            </Link>
                          ) : (
                            <div className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700">
                              <item.icon
                                className="h-6 w-6 shrink-0 text-gray-400"
                                aria-hidden="true"
                              />
                              <span className="text-xs sm:text-sm">{item.name}</span>
                            </div>
                          )}
                          {item.children && (
                            <ul className="mt-1 ml-6 sm:ml-8 space-y-1">
                              {item.children.map((child) => (
                                <li key={child.name}>
                                  <Link
                                    href={child.href}
                                    className={getChildClass(isActive(child.href))}
                                    onClick={close}
                                  >
                                    {child.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Barra de navegação móvel */}
      <div className="sticky top-0 z-40 flex items-center gap-x-4 bg-white px-4 py-3 shadow-sm sm:px-6">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700"
          onClick={toggle}
        >
          <span className="sr-only">Abrir menu</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-xs sm:text-sm font-semibold leading-6 text-gray-900">
          MuseTera
        </div>
      </div>

      {/* Sidebar desktop */}
      <Transition
        show={isOpen}
        as={Fragment}
        enter="transition-all ease-in-out duration-300"
        enterFrom="-translate-x-full opacity-0"
        enterTo="translate-x-0 opacity-100"
        leave="transition-all ease-in-out duration-300"
        leaveFrom="translate-x-0 opacity-100"
        leaveTo="-translate-x-full opacity-0"
      >
        <div className="fixed inset-y-0 z-50 flex w-64 xl:w-72 flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-4 xl:px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center justify-between">
              <h1 className="text-lg xl:text-xl font-semibold text-indigo-600">MuseTera</h1>
              <button 
                onClick={close}
                className="text-gray-500 hover:text-gray-700 lg:hidden"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-5 xl:gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        {item.href ? (
                          <Link
                            href={item.href}
                            className={getItemClass(isActive(item.href))}
                          >
                            <item.icon
                              className={getIconClass(isActive(item.href))}
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        ) : (
                          <div className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700">
                            <item.icon
                              className="h-6 w-6 shrink-0 text-gray-400"
                              aria-hidden="true"
                            />
                            {item.name}
                          </div>
                        )}
                        {item.children && (
                          <ul className="mt-1 px-2">
                            {item.children.map((child) => (
                              <li key={child.name}>
                                <Link
                                  href={child.href}
                                  className={getChildClass(isActive(child.href))}
                                >
                                  {child.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </Transition>
    </>
  )
}