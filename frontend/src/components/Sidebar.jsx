import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const menuItems = [
    { name: 'Overview', path: '/' },
    { name: 'Squad Roster', path: '/players' },
    { name: 'Tactical Insights', path: '/tactics' },
    { name: 'Coach Chat', path: '/chat' },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen text-white flex flex-col border-r border-slate-800">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-wider text-emerald-400">Gaffer AI</h1>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-emerald-500 text-slate-900' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center">
            👤
          </div>
          <div>
            <p className="text-sm font-medium">Head Coach</p>
            <p className="text-xs text-slate-400">Matchday Mode</p>
          </div>
        </div>
      </div>
    </div>
  );
}