import React from 'react';
import {
  AlertCircle,
  WifiOff,
  ShieldAlert,
  FileQuestion,
  ArrowLeft,
  RefreshCw,
  Home,
  Compass,
  ChevronDown,
  Plus,
  ArrowRight
} from 'lucide-react';
import SetupHeader from '../../components/setup/SetupHeader';
import useAuth from '../../hooks/auth/useAuth';
import { errorCodes } from '../../constants/errorCodes';
import usemyMemberships from '../../hooks/workspace/usemyMemberships';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../../constants/routePaths';

export default function ErrorPage({
  type = errorCodes.GENERAL,
  title,
  description,
  primaryActionText,
  onPrimaryAction,
  secondaryActionText,
  onSecondaryAction,
}) {

  const errorConfig = {
    [errorCodes.WORKSPACE_NOT_FOUND]: {
      icon: Compass,
      title: 'Workspace not found',
      description: 'The workspace you’re looking for might have been deleted, renamed, or the URL could be incorrect. Let’s get you back on track.',
      primaryText: 'Select a workspace',
      primaryIcon: ArrowRight,
      secondaryText: 'Create new workspace',
      secondaryIcon: Plus,
    },
    [errorCodes.PAGE_NOT_FOUND]: {
      icon: FileQuestion,
      title: 'Page not found',
      description: 'We couldn’t find the page you’re looking for. It might have been moved or the link is broken.',
      primaryText: 'Go back home',
      primaryIcon: Home, 
    },
    'no_internet': {
      icon: WifiOff,
      title: 'No internet connection',
      description: 'It looks like you’re offline. Please check your network connection and try again.',
      primaryText: 'Retry connection',
      primaryIcon: RefreshCw,
    },
    'access_denied': {
      icon: ShieldAlert,
      title: 'Access denied',
      description: 'You don’t have permission to view this page. Please contact your workspace administrator to request access.',
      primaryText: 'Return to dashboard',
      primaryIcon: ArrowLeft,
    },
    [errorCodes.GENERAL]: {
      icon: AlertCircle,
      title: 'Something went wrong',
      description: 'An unexpected error occurred. Our team has been notified and we are looking into it.',
      primaryText: 'Refresh page',
      primaryIcon: RefreshCw,
    }
  };

  const { data: currentUser } = useAuth()
  const { data: membershipData } = usemyMemberships()
  const myMemberships = membershipData?.memberships
  const isUserHaveWorkspace = myMemberships?.length > 0

  const config = errorConfig[type] || errorConfig['general'];
  const Icon = config.icon;
  const PrimaryIcon = config.primaryIcon;
  const SecondaryIcon = config.secondaryIcon;

  const displayTitle = title || config.title;
  const displayDescription = description || config.description;
  const displayPrimaryText = primaryActionText || config.primaryText;
  const displaySecondaryText = secondaryActionText || config.secondaryText;

  const navigate = useNavigate()
  const workspaceNotFound = type === errorCodes.WORKSPACE_NOT_FOUND
  const pageNotFound = type === errorCodes.PAGE_NOT_FOUND

  const handlePrimaryAction = () => {
    if (workspaceNotFound) {
      navigate(ROUTE_PATHS.WORKSPACES)
    }else if(pageNotFound) {
      navigate(ROUTE_PATHS.LOGIN)
    }else {
      onPrimaryAction()
    }
  }

  const handleSecondaryAction = () => {
    if (workspaceNotFound) {
      navigate(ROUTE_PATHS.CREATE_WORKSPACE)
    }else {
      onSecondaryAction()
    }
  }



  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden font-sans bg-[#FAFAFA]">
      <style>
        {`
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}
      </style>

      {/* Animated Soft Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-orange-100/30 blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-100/30 blur-[120px] animate-[pulse_10s_ease-in-out_infinite_1s]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[45%] h-[45%] rounded-full bg-teal-100/30 blur-[120px] animate-[pulse_9s_ease-in-out_infinite_2s]" />
      </div>

      {/* Optional Header */}
      {currentUser && (
        <SetupHeader />
      )}

      {/* Main Content Area */}
      <div className={`flex-1 w-full flex flex-col justify-center items-center px-6 pb-24 z-10 ${!currentUser ? 'pt-20' : ''}`}>
        <div className="w-full max-w-[420px] flex flex-col items-center text-center animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>

          {/* Card */}
          <div className="w-full bg-white/70 backdrop-blur-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] p-8 sm:p-10 flex flex-col items-center relative">

            {/* Elegant Icon Container */}
            <div className="mb-8 flex justify-center items-center relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-white rounded-2xl blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-16 h-16 bg-gradient-to-b from-white to-gray-50 border border-gray-100/80 shadow-[0_4px_16px_rgb(0,0,0,0.04)] rounded-[18px] flex items-center justify-center transform group-hover:-translate-y-1 transition-transform duration-500">
                <Icon className="w-7 h-7 text-gray-700" strokeWidth={1.25} />
              </div>
            </div>

            {/* Typography */}
            <h1 className="text-gray-900 font-bold text-[24px] leading-tight mb-3 tracking-tight">
              {displayTitle}
            </h1>
            <p className="text-[15px] leading-[1.6] text-gray-500 mb-9 max-w-[320px]">
              {displayDescription}
            </p>

            {/* Actions */}
            <div className="w-full flex flex-col gap-3">
              {
                (isUserHaveWorkspace || type !== errorCodes.WORKSPACE_NOT_FOUND) &&
                <button
                  onClick={handlePrimaryAction}
                  className="w-full h-11 px-4 bg-[#1D9E75] hover:bg-[#168965] text-white font-medium text-[14px] rounded-[12px] shadow-[0_2px_8px_rgba(29,158,117,0.25)] hover:shadow-[0_4px_14px_rgba(29,158,117,0.35)] transition-all duration-300 transform hover:-translate-y-[2px] flex justify-center items-center gap-2 group"
                >
                  {type === 'workspace_not_found' || type === 'access_denied' ? (
                    <PrimaryIcon className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-x-0.5" strokeWidth={2} />
                  ) : null}
                  {displayPrimaryText}
                  {type !== 'workspace_not_found' && type !== 'access_denied' ? (
                    <PrimaryIcon className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5" strokeWidth={2} />
                  ) : null}
                </button>
              }


              {(displaySecondaryText || onSecondaryAction) && (
                <button
                  onClick={handleSecondaryAction}
                  className="w-full h-11 px-4 bg-white/80 hover:bg-gray-50 text-gray-600 hover:text-gray-900 font-medium text-[14px] rounded-[12px] border border-gray-200/80 hover:border-gray-300 shadow-sm hover:shadow transition-all duration-300 flex justify-center items-center gap-2 group transform hover:-translate-y-[1px]"
                >
                  {SecondaryIcon && <SecondaryIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />}
                  {displaySecondaryText || 'Contact support'}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
