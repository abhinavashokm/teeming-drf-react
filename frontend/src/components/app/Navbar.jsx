import {
  Bell
} from 'lucide-react';

function Navbar({ isNavbarVisible, isScrolled }) {


  return (
    <header
      className={`bg-white transition-all duration-200 overflow-hidden flex items-center justify-between shrink-0 w-full ${isNavbarVisible ? 'h-[44px]' : 'h-0 opacity-0'} ${isScrolled ? 'border-b border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.06)]' : 'border-b border-transparent'}`}
    >
      <div className="flex items-center gap-2 pl-24 flex-1">
        <span className="text-[13px] font-medium text-gray-500">Acme Corp</span>
        <span className="text-gray-300 mx-1">›</span>
        <span className="text-[13px] font-medium text-gray-900">Home</span>
      </div>

      <div className="flex items-center pr-4 mr-2 justify-end">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <Bell className="h-[17px] w-[17px]" strokeWidth={1.5} />
          <span className="absolute top-1.5 right-1.5 block h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
      </div>
    </header>
  )
}

export default Navbar