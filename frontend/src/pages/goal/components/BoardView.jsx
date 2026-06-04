
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, ListFilter, MoreHorizontal, Plus, Search, ThumbsUp } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';


const initialIdeasCards = [
    { id: 'i1', title: 'Add one-click Apple Pay option', assignee: { initials: 'AJ', name: 'Arjun', bgClass: 'bg-blue-100', textClass: 'text-blue-700' }, thumbsUp: 5, date: '2026-05-30T10:00:00Z' },
    { id: 'i2', title: 'Simplify address form fields', assignee: { initials: 'SM', name: 'Sarah', bgClass: 'bg-purple-100', textClass: 'text-purple-700' }, thumbsUp: 12, date: '2026-05-29T10:00:00Z' },
    { id: 'i3', title: 'Implement PayPal integration', assignee: { initials: 'KL', name: 'Kevin', bgClass: 'bg-teal-100', textClass: 'text-teal-700' }, thumbsUp: 8, date: '2026-05-28T14:30:00Z' },
    { id: 'i4', title: 'Add progress indicator for checkout steps', assignee: { initials: 'AJ', name: 'Arjun', bgClass: 'bg-blue-100', textClass: 'text-blue-700' }, thumbsUp: 3, date: '2026-05-27T09:15:00Z' },
    { id: 'i5', title: 'Auto-fill shipping address via Google Maps', assignee: { initials: 'TR', name: 'Tom', bgClass: 'bg-amber-100', textClass: 'text-amber-700' }, thumbsUp: 21, date: '2026-05-26T11:45:00Z' },
    { id: 'i6', title: 'Remove mandatory account creation', assignee: { initials: 'SM', name: 'Sarah', bgClass: 'bg-purple-100', textClass: 'text-purple-700' }, thumbsUp: 45, date: '2026-05-25T16:20:00Z' },
    { id: 'i7', title: 'Display trust badges near payment button', assignee: { initials: 'KL', name: 'Kevin', bgClass: 'bg-teal-100', textClass: 'text-teal-700' }, thumbsUp: 6, date: '2026-05-24T13:10:00Z' },
    { id: 'i8', title: 'Offer Buy Now, Pay Later (Klarna/Affirm)', assignee: { initials: 'AJ', name: 'Arjun', bgClass: 'bg-blue-100', textClass: 'text-blue-700' }, thumbsUp: 14, date: '2026-05-23T08:50:00Z' },
    { id: 'i9', title: 'Make coupon code field collapsible', assignee: { initials: 'TR', name: 'Tom', bgClass: 'bg-amber-100', textClass: 'text-amber-700' }, thumbsUp: 9, date: '2026-05-22T10:05:00Z' },
    { id: 'i10', title: 'Highlight free shipping threshold in cart', assignee: { initials: 'SM', name: 'Sarah', bgClass: 'bg-purple-100', textClass: 'text-purple-700' }, thumbsUp: 19, date: '2026-05-21T15:30:00Z' },
    { id: 'i11', title: 'Add real-time inline form validation', assignee: { initials: 'KL', name: 'Kevin', bgClass: 'bg-teal-100', textClass: 'text-teal-700' }, thumbsUp: 11, date: '2026-05-20T12:00:00Z' },
    { id: 'i12', title: 'Use numeric keypad for mobile card entry', assignee: { initials: 'AJ', name: 'Arjun', bgClass: 'bg-blue-100', textClass: 'text-blue-700' }, thumbsUp: 27, date: '2026-05-19T09:40:00Z' },
    { id: 'i13', title: 'Add express checkout button on product page', assignee: { initials: 'TR', name: 'Tom', bgClass: 'bg-amber-100', textClass: 'text-amber-700' }, thumbsUp: 16, date: '2026-05-18T14:15:00Z' },
    { id: 'i14', title: 'Show order summary floating on desktop', assignee: { initials: 'SM', name: 'Sarah', bgClass: 'bg-purple-100', textClass: 'text-purple-700' }, thumbsUp: 4, date: '2026-05-17T11:20:00Z' },
    { id: 'i15', title: 'Default billing address to shipping address', assignee: { initials: 'KL', name: 'Kevin', bgClass: 'bg-teal-100', textClass: 'text-teal-700' }, thumbsUp: 33, date: '2026-05-16T10:30:00Z' },
    { id: 'i16', title: 'Retain cart items for abandoned checkouts', assignee: { initials: 'AJ', name: 'Arjun', bgClass: 'bg-blue-100', textClass: 'text-blue-700' }, thumbsUp: 22, date: '2026-05-15T08:00:00Z' },
    { id: 'i17', title: 'Include localized tax calculation estimate', assignee: { initials: 'TR', name: 'Tom', bgClass: 'bg-amber-100', textClass: 'text-amber-700' }, thumbsUp: 7, date: '2026-05-14T13:45:00Z' }
];

const initialProgressCards = [
    { id: 'p1', title: 'Add guest checkout', assignees: [{ initials: 'TR', bgClass: 'bg-amber-100', textClass: 'text-amber-700' }, { initials: 'AJ', bgClass: 'bg-blue-100', textClass: 'text-blue-700' }], comments: 8, date: '2026-05-31T10:00:00Z', isProgress: true }
];

const initialDoneCards = [
    { id: 'd1', title: 'Fix mobile keyboard layout', assignee: { initials: 'KL', name: 'Kevin', bgClass: 'bg-teal-100', textClass: 'text-teal-700' }, comments: 2, date: '2026-05-28T10:00:00Z', isDone: true },
    { id: 'd2', title: 'Update privacy policy', assignee: { initials: 'AJ', name: 'Arjun', bgClass: 'bg-blue-100', textClass: 'text-blue-700' }, comments: 1, date: '2026-05-20T10:00:00Z', isDone: true },
    { id: 'd3', title: 'Implement social login', assignee: { initials: 'SM', name: 'Sarah', bgClass: 'bg-purple-100', textClass: 'text-purple-700' }, comments: 4, date: '2026-05-15T10:00:00Z', isDone: true }
];

const initialActivities = [
    { id: 'a1', type: 'completed', user: { initials: 'SM', name: 'Sara', bgClass: 'bg-purple-100', textClass: 'text-purple-700' }, target: 'Identify drop-off points', dateGroup: 'TODAY', time: '10:31 am' },
    { id: 'a2', type: 'moved', user: { initials: 'AJ', name: 'Arjun', bgClass: 'bg-blue-100', textClass: 'text-blue-700' }, target: 'Write copy for new flow', destination: 'Ongoing', dateGroup: 'TODAY', time: '9:15 am' },
    { id: 'a3', type: 'commented', user: { initials: 'KL', name: 'Kiran', bgClass: 'bg-teal-100', textClass: 'text-teal-700' }, target: 'Redesign payment step UI', dateGroup: 'YESTERDAY', time: '4:45 pm' },
    { id: 'a4', type: 'updated_outcome', user: { initials: 'SM', name: 'Sara', bgClass: 'bg-purple-100', textClass: 'text-purple-700' }, target: 'Drop-off Reduced', dateGroup: 'YESTERDAY', time: '2:30 pm' },
    { id: 'a5', type: 'added_task', user: { initials: 'AJ', name: 'Arjun', bgClass: 'bg-blue-100', textClass: 'text-blue-700' }, target: 'Deploy to production', dateGroup: 'June 1', time: '11:20 am' },
    { id: 'a6', type: 'joined', user: { initials: 'SM', name: 'Sara', bgClass: 'bg-purple-100', textClass: 'text-purple-700' }, dateGroup: 'June 1', time: '9:00 am' }
];

const CardRenderer = ({ card, theme, onClick }) => {
  if (card.isDone) {
    return (
      <div onClick={onClick} className={`bg-white/80 border ${theme.cardBorder || 'border-gray-200'} rounded-xl p-4 shadow-sm hover:border-gray-300 hover:shadow transition-all cursor-pointer relative group`}>
        <div className="flex items-start justify-between mb-3">
          <p className="text-[14px] font-medium text-gray-500 line-through decoration-gray-400">
            {card.title}
          </p>
          <button className="text-gray-400 hover:text-gray-600 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between opacity-75 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <div className={`w-5 h-5 rounded-full ${card.assignee?.bgClass || 'bg-gray-100'} flex items-center justify-center text-[9px] font-medium ${card.assignee?.textClass || 'text-gray-600'}`}>
              {card.assignee?.initials}
            </div>
            <span className="text-[11.5px] font-medium text-gray-600">{card.assignee?.name}</span>
          </div>
          <span className="text-[11px] text-gray-400">2d ago</span>
        </div>
      </div>
    );
  }

  if (card.isProgress) {
    return (
      <div onClick={onClick} className={`bg-white border ${theme.cardBorder || 'border-gray-200'} rounded-xl p-4 shadow-sm hover:border-gray-300 hover:shadow transition-all cursor-pointer relative overflow-hidden group`}>
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#378ADD]"></div>
        <div className="flex items-start justify-between mb-4">
          <p className="text-[14px] font-medium text-gray-900 group-hover:text-[#378ADD] transition-colors pr-2">
            {card.title}
          </p>
          <button className="text-gray-400 hover:text-gray-600 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex -space-x-1.5">
            {card.assignees?.map((a, i) => (
              <div key={i} className={`w-6 h-6 rounded-full ${a.bgClass} flex items-center justify-center text-[10px] font-medium ${a.textClass} ring-2 ring-white`}>
                {a.initials}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1 text-amber-600 text-[11.5px] font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
            <AlertCircle className="w-3.5 h-3.5" />
            Due Jun 5
          </div>
        </div>
      </div>
    );
  }

  // Ideas to try (isIdea)
  return (
    <div onClick={onClick} className={`bg-white border ${theme.cardBorder || 'border-gray-200'} rounded-xl p-4 shadow-sm hover:border-gray-300 hover:shadow transition-all cursor-pointer relative group`}>
      <div className="flex items-start gap-2.5 mb-3">
        <div className={`w-6 h-6 rounded-full ${card.assignee?.bgClass || 'bg-gray-100'} flex items-center justify-center text-[10px] font-medium shrink-0 mt-0.5 ${card.assignee?.textClass || 'text-gray-600'}`}>
          {card.assignee?.initials}
        </div>
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-[14px] font-medium text-gray-900 group-hover:text-teeming-green transition-colors leading-snug">
            {card.title}
          </p>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-gray-400 text-[12px] font-medium">
          <ThumbsUp className="w-3.5 h-3.5" /> {card.thumbsUp || 0}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11.5px] font-medium text-gray-600">{card.assignee?.name}</span>
          <span className="text-[11px] text-gray-400">· 2h ago</span>
        </div>
      </div>
    </div>
  );
};


const KanbanColumn = ({ id, title, theme, initialCards, showAddIdea, onAddIdea, onCardClick }) => {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        return localStorage.getItem(`kanban-col-collapsed-${id}`) === 'true';
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [sortBy, setSortBy] = useState('Newest');
    const [isSortOpen, setIsSortOpen] = useState(false);

    const searchInputRef = useRef(null);
    const sortRef = useRef(null);
    const searchContainerRef = useRef(null);

    const toggleCollapse = () => {
        const newVal = !isCollapsed;
        setIsCollapsed(newVal);
        localStorage.setItem(`kanban-col-collapsed-${id}`, newVal);
    };

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (sortRef.current && !sortRef.current.contains(e.target)) {
                setIsSortOpen(false);
            }
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsSearchOpen(false);
        }
    };

    let displayCards = [...initialCards];
    if (searchQuery) {
        displayCards = displayCards.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    displayCards.sort((a, b) => {
        if (sortBy === 'Newest') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'Oldest') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'Most comments') return b.comments - a.comments;
        if (sortBy === 'Assignee') {
            const getAss = (c) => c.assignee ? c.assignee.initials : (c.assignees ? c.assignees[0].initials : '');
            return getAss(a).localeCompare(getAss(b));
        }
        return 0;
    });

    if (isCollapsed) {
        return (
            <div
                className={`flex flex-col items-center py-4 px-2 w-[48px] shrink-0 rounded-2xl border cursor-pointer hover:opacity-80 transition-opacity ${theme.bg} ${theme.border} h-[calc(100vh-220px)] min-h-[400px] max-h-[700px]`}
                onClick={toggleCollapse}
                title={`Expand ${title}`}
            >
                <div className="flex flex-col items-center gap-4 h-full w-full">
                    <span className={`py-0.5 px-2 rounded-full text-xs font-semibold ${theme.countBg} ${theme.countText}`}>{displayCards.length}</span>
                    <div className="flex-1 flex justify-center items-start w-full mt-2 overflow-hidden">
                        <h3 className="text-[14px] font-semibold text-gray-700 tracking-wider [writing-mode:vertical-rl]">
                            {title}
                        </h3>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 mt-auto shrink-0" />
                </div>
            </div>
        );
    }

    return (
        <div id={`col-${id}`} className={`w-[85vw] md:w-auto md:flex-1 shrink-0 snap-start min-w-[216px] flex flex-col rounded-2xl border max-h-[calc(100vh-220px)] ${theme.bg} ${theme.border} overflow-hidden`}>
            {/* Header (Sticky area) */}
            <div className="shrink-0 p-3 pb-2 border-b border-transparent" ref={searchContainerRef}>
                <div className="flex items-center justify-between mb-1 px-1">
                    <div className="flex items-center gap-2 truncate pr-2">
                        <h3 className="text-[14px] font-semibold text-gray-900 truncate">{title}</h3>
                        <span className={`py-0.5 px-2 rounded-full text-xs font-semibold shrink-0 ${theme.countBg} ${theme.countText}`}>{displayCards.length}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        <button
                            className={`transition-colors p-1 rounded-md ${isSearchOpen ? 'text-gray-900 bg-gray-200' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600'}`}
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            title="Search cards"
                        >
                            <Search className="w-4 h-4" />
                        </button>
                        <div className="relative" ref={sortRef}>
                            <button
                                className={`transition-colors p-1 rounded-md ${isSortOpen ? 'text-gray-900 bg-gray-200' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600'}`}
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                title="Sort cards"
                            >
                                <ListFilter className="w-4 h-4" />
                            </button>
                            {isSortOpen && (
                                <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 shadow-lg rounded-lg py-1 z-20">
                                    {['Newest', 'Oldest', 'Most comments', 'Assignee'].map(opt => (
                                        <button key={opt} className={`w-full text-left px-3 py-1.5 text-[13px] ${sortBy === opt ? 'bg-gray-50 text-[#378ADD] font-medium' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => { setSortBy(opt); setIsSortOpen(false); }}>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-200" onClick={toggleCollapse} title="Collapse column">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Search Input inline below header */}
                {isSearchOpen && (
                    <div className="mt-2 px-1">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Filter cards..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#378ADD]/20 focus:border-[#378ADD]"
                        />
                    </div>
                )}
            </div>

            {/* Scrollable Cards Area */}
            <div className="flex-1 h-full overflow-y-auto scrollbar-hide px-3 pb-3">
                <div className="flex flex-col gap-3">
                    {displayCards.slice(0, title === 'Done' ? 1 : displayCards.length).map(card => (
                        <CardRenderer key={card.id} card={card} theme={theme} onClick={() => onCardClick(card, id)} />
                    ))}
                    {title === 'Done' && displayCards.length > 1 && (
                        <button className="text-[12px] font-medium text-gray-500 hover:text-gray-900 transition-colors py-1 w-full text-center">
                            +{displayCards.length - 1} more completed
                        </button>
                    )}
                </div>
            </div>

            {showAddIdea && (
                <div className="shrink-0 px-3 pb-3 pt-1 mt-auto">
                    <button onClick={onAddIdea} className="flex items-center justify-center gap-1.5 w-full text-green-600 hover:text-green-700 hover:bg-amber-100/40 rounded-xl py-2 transition-colors text-[13px] font-medium">
                        <Plus className="w-4 h-4" /> Add idea
                    </button>
                </div>
            )}
        </div>
    );
};

function BoardView({ isRightPanelOpen }) {
    return (
        <div className="mb-12 pb-4 -mx-4 px-4 md:mx-0 md:px-0">

            {/* Mobile Tab Switcher */}
            <div className="md:hidden flex overflow-x-auto gap-2 mb-4 scrollbar-hide pb-2">
                <button onClick={() => scrollToColumn('col-ideas')} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-[12px] font-bold border border-amber-200">Ideas ({initialIdeasCards.length})</button>
                <button onClick={() => scrollToColumn('col-progress')} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-blue-50 text-[#378ADD] text-[12px] font-bold border border-[#378ADD]/30">In Progress ({initialProgressCards.length})</button>
                <button onClick={() => scrollToColumn('col-done')} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-[12px] font-bold border border-green-200">Done ({initialDoneCards.length})</button>
            </div>

            <div className={`flex gap-4 md:gap-6 w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 after:content-[''] after:shrink-0 ${isRightPanelOpen ? 'lg:after:w-[340px]' : 'after:w-4'}`}>
                <KanbanColumn
                    id="ideas"
                    title="Ideas to try"
                    theme={{ bg: 'bg-amber-50/40', border: 'border-amber-100/60', countBg: 'bg-gray-200/70', countText: 'text-gray-600' }}
                    initialCards={initialIdeasCards}
                    showAddIdea={true}
                    onAddIdea={() => setIsAddIdeaModalOpen(true)}
                    onCardClick={(card, status) => { setSelectedIdeaCard(card); setSelectedIdeaStatus(status); }}
                />
                <KanbanColumn
                    id="progress"
                    title="In Progress"
                    theme={{ bg: 'bg-[#378ADD]/5', border: 'border-[#378ADD]/10', countBg: 'bg-[#378ADD]/10', countText: 'text-[#378ADD]', cardBorder: 'border-[#378ADD]/30' }}
                    initialCards={initialProgressCards}
                    onCardClick={(card, status) => { setSelectedIdeaCard(card); setSelectedIdeaStatus(status); }}
                />
                <KanbanColumn
                    id="done"
                    title="Done"
                    theme={{ bg: 'bg-green-50/50', border: 'border-green-100/50', countBg: 'bg-green-100/80', countText: 'text-green-700' }}
                    initialCards={initialDoneCards}
                    onCardClick={(card, status) => { setSelectedIdeaCard(card); setSelectedIdeaStatus(status); }}
                />
            </div>
        </div>
    )
}

export default BoardView