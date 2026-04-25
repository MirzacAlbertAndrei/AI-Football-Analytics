import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const menuItems = [
    { name: 'Overview', path: '/' },
    { name: 'Squad Roster', path: '/players' },
    { name: 'AI Powered Report', path: '/tactics' },
    { name: 'AI Coach Chat', path: '/chat' },
  ];

  return (
    <div className="w-64 bg-black h-screen text-white flex flex-col border-r border-gray-900 shrink-0 font-sans shadow-2xl">
      {/* Header / Brand Area */}
      <div className="h-24 flex items-center px-8 border-b border-gray-900 relative overflow-hidden">
        <div className="absolute left-0 top-0 w-1.5 h-full bg-red-600"></div>
        <h1 className="text-3xl font-black text-white tracking-widest uppercase">
          AI <span className="text-red-600">Coach Assist</span>
        </h1>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 py-8 px-4 space-y-3 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `relative flex items-center px-4 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 group overflow-hidden ${
                isActive 
                  ? 'bg-white text-black shadow-md' 
                  : 'text-gray-400 hover:bg-gray-900 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active Indicator Line */}
                {isActive && (
                  <div className="absolute left-0 top-0 w-1.5 h-full bg-red-600"></div>
                )}
                
                {/* Text with Hover Translation */}
                <span className={`transform transition-transform duration-300 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-2'}`}>
                  {item.name}
                </span>

                {/* Animated Arrow on Hover (Only for inactive items) */}
                {!isActive && (
                  <svg 
                    className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-red-600" 
                    fill="none" 
                    strokeWidth="3" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-6 border-t border-gray-900 bg-black">
        <div className="flex items-center gap-4 group cursor-pointer p-2 rounded-xl hover:bg-gray-900 transition-colors duration-300">
          <div className="h-12 w-12 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-red-600 font-black group-hover:border-red-600 transition-colors duration-300 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-0 bg-red-600 group-hover:h-full transition-all duration-300 z-0"></div>
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">HC</span>
          </div>
          
          {/* Details */}
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white">Head Coach</p>
            <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mt-0.5">U Cluj Staff</p>
          </div>
        </div>
      </div>
    </div>
  );
}