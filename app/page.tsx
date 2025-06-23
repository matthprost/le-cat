import Image from 'next/image'
import { SidebarTrigger } from '@/components/ui/sidebar'

export default function Home() {
  return (
    <div className="h-full grow flex flex-col font-[family-name:var(--font-geist-sans)] w-full">
      <div className="flex p-2" id="topbar">
        <SidebarTrigger />
      </div>

      <main className="flex flex-col gap-[32px] h-full row-start-2 items-center sm:items-start p-8 pb-20 gap-16 sm:p-20 ">
        <div className="flex flex-col w-full px-120">okok</div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-start py-3 px-4">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/#"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/#"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
      </footer>
    </div>
  )
}
