
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, ListFilter, MoreHorizontal, Plus, Search, ThumbsUp } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import AddIdeaModal from '../../../components/goal/AddIdeaModal';
import KanbanColumn from '../../../components/idea/KanbanColumn';


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
                <KanbanColumn state="draft" initialCards={initialIdeasCards} />
                <KanbanColumn state="in_progress" initialCards={initialProgressCards}  />
                <KanbanColumn state="done" initialCards={initialDoneCards}  />

            </div>

        </div>
    )
}

export default BoardView