/**
 * NotificationAlertDialog - Dev Notes notification system for VRS/A
 * Shows updates, announcements, and notes from the developer
 * Fetches notifications from Supabase
 */

import React, { useState, useEffect, useCallback } from 'react';
import { BellRing, X, Clock, Check, Sparkles, Music, Wrench, Heart, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './AlertDialog';
import { Button } from './Button';
import { cn } from '../../lib/utils';
import { getActiveDevNotes } from '../../lib/admin';

// Notification types with icons
const NOTIFICATION_ICONS = {
  update: Wrench,
  feature: Sparkles,
  music: Music,
  thanks: Heart,
  default: BellRing,
};

// Storage key for persisting read state
const STORAGE_KEY = 'vrsa-dev-notes-read';

// Helper to format relative time
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};

export function NotificationAlertDialog() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  // Fetch notifications from Supabase
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    const { notes, error } = await getActiveDevNotes();
    
    if (!error && notes) {
      // Load read state from localStorage
      let readIds = [];
      try {
        const savedReadState = localStorage.getItem(STORAGE_KEY);
        if (savedReadState) {
          readIds = JSON.parse(savedReadState);
        }
      } catch (e) {
        console.error('Failed to load notification state:', e);
      }

      // Transform notes for display
      const transformedNotes = notes.map(note => ({
        id: note.id,
        type: note.type,
        title: note.title,
        message: note.message,
        link: note.link,
        linkText: note.link_text,
        time: formatRelativeTime(note.created_at),
        read: readIds.includes(note.id),
      }));
      
      setNotifications(transformedNotes);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Save read state to localStorage
  const saveReadState = (notifs) => {
    try {
      const readIds = notifs.filter(n => n.read).map(n => n.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(readIds));
    } catch (e) {
      console.error('Failed to save notification state:', e);
    }
  };

  const markAsRead = (id) => {
    const updated = notifications.map((notification) => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updated);
    saveReadState(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map((notification) => ({ ...notification, read: true }));
    setNotifications(updated);
    saveReadState(updated);
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const getIcon = (type) => {
    const IconComponent = NOTIFICATION_ICONS[type] || NOTIFICATION_ICONS.default;
    return IconComponent;
  };

  return (
    <>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="relative text-slate-400 hover:text-indigo-400"
          >
            <BellRing className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {unreadCount}
              </span>
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="border-indigo-600/30 border-2 max-w-md bg-slate-900">
          <AlertDialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellRing className="h-5 w-5 text-indigo-400" />
                <AlertDialogTitle>Dev Notes</AlertDialogTitle>
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs text-indigo-400 hover:text-indigo-300 hover:bg-slate-800"
                >
                  Mark all as read
                </Button>
              )}
            </div>
            <AlertDialogDescription>
              {loading 
                ? 'Loading notifications...'
                : unreadCount > 0 
                  ? `You have ${unreadCount} unread ${unreadCount === 1 ? 'note' : 'notes'} from the developer.`
                  : "You're all caught up! Check back for future updates."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-3 space-y-2 max-h-64 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="text-indigo-400 animate-spin" />
              </div>
            ) : notifications.slice(0, showAllNotifications ? notifications.length : 3).map((notification) => {
              const Icon = getIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer",
                    notification.read 
                      ? "bg-slate-800/50" 
                      : "bg-indigo-600/20 border border-indigo-600/30 shadow-sm",
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      notification.read
                        ? "bg-slate-700 text-slate-400"
                        : "bg-indigo-600/30 text-indigo-400",
                    )}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        notification.read ? "text-slate-300" : "text-white",
                      )}
                    >
                      {notification.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{notification.message}</p>
                    {notification.link && (
                      <a 
                        href={notification.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-400 hover:text-indigo-300 mt-1 inline-block"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {notification.linkText || 'Learn more'} →
                      </a>
                    )}
                    <div className="flex items-center text-xs text-slate-500 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {notification.time}
                    </div>
                  </div>
                  {!notification.read && (
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 shrink-0 mt-1"></span>
                  )}
                </div>
              );
            })}
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setShowAllNotifications(false)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Close
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-indigo-600 hover:bg-indigo-500"
              onClick={() => {
                setShowAllNotifications(true);
                setIsDialogOpen(false);
                document.body.classList.add("overflow-hidden");
              }}
            >
              View All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Full-screen slide-out panel for all notifications */}
      <div
        className={cn(
          "fixed inset-0 bg-black/70 z-50 transition-opacity duration-300",
          showAllNotifications ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <div
          className={cn(
            "fixed top-0 right-0 h-full shadow-2xl transition-transform duration-300 ease-in-out transform w-full max-w-md",
            "bg-slate-900 border-l border-slate-700",
            showAllNotifications ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellRing className="h-5 w-5 text-indigo-400" />
                <h2 className="text-lg font-semibold text-white">All Dev Notes</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowAllNotifications(false);
                  document.body.classList.remove("overflow-hidden");
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <BellRing className="h-12 w-12 mb-2 text-slate-700" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = getIcon(notification.type);
                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-xl transition-all duration-200 cursor-pointer",
                        notification.read
                          ? "bg-slate-800/50 border border-slate-700/50"
                          : "bg-indigo-600/20 border border-indigo-600/30 shadow-sm",
                      )}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                          notification.read
                            ? "bg-slate-700 text-slate-400"
                            : "bg-indigo-600/30 text-indigo-400",
                        )}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p
                            className={cn(
                              "text-sm font-medium",
                              notification.read ? "text-slate-300" : "text-white",
                            )}
                          >
                            {notification.title}
                          </p>
                          <div className="flex items-center text-xs text-slate-500 ml-2 shrink-0">
                            <Clock className="h-3 w-3 mr-1" />
                            {notification.time}
                          </div>
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{notification.message}</p>
                        
                        {notification.link && (
                          <a 
                            href={notification.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 mt-2 font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {notification.linkText || 'Learn more'} →
                          </a>
                        )}

                        {notification.read && (
                          <div className="flex items-center mt-2 text-xs text-slate-500">
                            <Check className="h-3 w-3 mr-1" />
                            Read
                          </div>
                        )}
                      </div>
                      {!notification.read && (
                        <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 shrink-0 mt-2"></span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700">
              <Button
                className="w-full"
                onClick={() => {
                  markAllAsRead();
                  setShowAllNotifications(false);
                  document.body.classList.remove("overflow-hidden");
                }}
              >
                Mark All as Read
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotificationAlertDialog;
