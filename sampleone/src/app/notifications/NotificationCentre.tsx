"use client";

import { useState, useEffect } from "react";
import { 
  Bell, CheckCircle, X, Filter, 
  ChevronDown, Search, Send, Plus, Users, 
  Calendar, Megaphone, Bookmark, ChevronRight
} from "lucide-react";
import axios from "axios";

type Notifications = {
  id: number;
  message: string;
  sender_id: string;
  timestamp: string;
  type: string;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedNotification, setExpandedNotification] = useState(null);
  
  // Send notification modal state
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [newNotification, setNewNotification] = useState({
    message: "",
    type: "announcement",
  });
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  //my api
  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:8000/notifications/all");
      if (res.data.success) {
        setNotifications(res.data.data.reverse());
        setLoading(false); // don't forget to turn off loading state
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
          fetchNotifications();
      }, []);

  // Mock notifications data - would fetch from API in real app
  


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  const deleteNotification = async (id) => {
    try {
      // Call FastAPI backend to delete from DB
      await axios.delete(`http://localhost:8000/notifications/${id}`);
  
      // If successful, remove it from frontend state
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete notification:", error);
      // Optional: show error to user (e.g., toast)
    }
  };

  const toggleExpand = (id) => {
    setExpandedNotification(expandedNotification === id ? null : id);
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
  
    const timestamp = new Date().toISOString();
    const newNotificationObj = {
      id: notifications.length + 1,
      message: newNotification.message,
      timestamp: timestamp,
      type: newNotification.type,
    };
  
    try {
      const response = await axios.post("http://localhost:8000/notifications/create", {
        id:newNotificationObj.id,
        message: newNotificationObj.message,
        sender_id: "saharawardenofficial@gmail.com",
        timestamp: newNotificationObj.timestamp,
        type: newNotificationObj.type,
      });
  
      if (response.data.success) {
        setNotifications([newNotificationObj, ...notifications]);
        setSendSuccess(true);
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  
    setTimeout(() => {
      setIsSendModalOpen(false);
      setSendSuccess(false);
      setNewNotification({
        message: "",
        type: "announcement",
      });
      setSelectedStudents([]);
    }, 1500);
  };
  

  const filteredNotifications = notifications.filter((notification) => {
    // Filter by type
    if (filter !== "all" && notification.type !== filter) return false;
    
    // Filter by search query
    if (searchQuery && !notification.message.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Function to truncate text
  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Category options with nice labels and colors
  const notificationTypes = [
    { id: "all", label: "All Notifications", icon: Bell, color: "bg-blue-100 text-blue-800" },
    { id: "announcement", label: "Announcements", icon: Megaphone, color: "bg-orange-100 text-orange-800" },
    { id: "system", label: "System", icon: Bell, color: "bg-pink-100 text-pink-800" },
    { id: "report", label: "Reports", icon: Bookmark, color: "bg-indigo-100 text-indigo-800" },
  ];

  const getTypeIcon = (type) => {
    const found = notificationTypes.find(t => t.id === type);
    const Icon = found?.icon || Bell;
    return <Icon className="h-5 w-5" />;
  };

  const getTypeColor = (type) => {
    const found = notificationTypes.find(t => t.id === type);
    return found ? found.color : "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-3xl border border-green-300 shadow-lg overflow-hidden w-full">
      {/* Header with Send Button */}
      <div className="flex items-center gap-3 p-3 border-b border-green-100">
        <Bell className="text-green-600 h-5 w-5" />
        <h2 className="text-base font-semibold text-green-800">
          Notifications
        </h2>
        <div className="ml-auto flex gap-2">
          <button 
            onClick={() => setIsSendModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full p-1.5 flex items-center justify-center shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="p-3 border-b border-green-100 flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[150px]">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-2 py-1.5 text-sm w-full rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <Search className="absolute left-2 top-2 h-4 w-4 text-green-500" />
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowFilterOptions(!showFilterOptions)}
            className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border ${
              filter !== "all" 
                ? "bg-green-50 border-green-300 text-green-700" 
                : "border-green-200 hover:bg-green-50"
            }`}
          >
            <Filter className="h-3 w-3" />
            <span>{notificationTypes.find((t) => t.id === filter)?.label || "All"}</span>
            <ChevronDown className="h-3 w-3" />
          </button>
          
          {showFilterOptions && (
            <div className="absolute z-10 mt-1 w-40 bg-white rounded-xl shadow-lg border border-green-100 py-1 right-0 overflow-hidden">
              {notificationTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setFilter(type.id);
                    setShowFilterOptions(false);
                  }}
                  className={`flex items-center gap-2 w-full text-left px-3 py-1.5 text-xs hover:bg-green-50 ${
                    filter === type.id ? "bg-green-50 font-medium" : ""
                  }`}
                >
                  <type.icon className="h-3 w-3" />
                  {type.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="h-[460px] overflow-y-auto p-3 pb-6 space-y-3">
        {loading ? (
          <div className="flex flex-col space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-[#f1fdf3] border border-green-100 rounded-lg p-3">
                <div className="h-3 bg-green-100 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-green-100 rounded w-full mb-2"></div>
                <div className="h-3 bg-green-100 rounded w-5/6"></div>
                <div className="flex justify-end mt-2">
                  <div className="h-2 bg-green-100 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Bell className="mx-auto h-10 w-10 text-gray-300 mb-2" />
            <p className="text-sm">No notifications found</p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="text-green-600 text-xs mt-2"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className="relative bg-[#f1fdf3] border border-green-300
                rounded-lg p-3 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-2">
                  <div className={`p-1.5 rounded-lg ${getTypeColor(notification.type)}`}>
                    {getTypeIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div 
                      className="text-sm text-gray-800"
                      onClick={() => toggleExpand(notification.id)}
                    >
                      {expandedNotification === notification.id ? (
                        <p>{notification.message}</p>
                      ) : (
                        <div className="flex items-start">
                          <p className="flex-1">{truncateText(notification.message)}</p>
                          {notification.message.length > 100 && (
                            <button 
                              className="ml-1 text-green-600 flex-shrink-0 mt-0.5 p-0.5 hover:bg-green-100 rounded-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand(notification.id);
                              }}
                            >
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-400 italic">
                        {formatDate(notification.timestamp)}
                      </p>
                      
                      <div className="flex gap-2 group-hover:opacity-100 transition-opacity">
                        {expandedNotification === notification.id && (
                          <button
                            onClick={() => toggleExpand(null)}
                            className="text-green-500 hover:text-green-700 p-0.5 hover:bg-green-100 rounded-full"
                            title="Collapse"
                          >
                            <ChevronDown className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-500 hover:text-red-700 p-0.5 hover:bg-red-100 rounded-full"
                          title="Delete"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      <Users className="h-3 w-3" />
                      <span>Sent to students</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Send Notification Modal */}
      {isSendModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-green-200">
            <div className="flex justify-between items-center border-b border-green-100 p-5 bg-[#f1fdf3]">
              <div className="flex items-center gap-2">
                <Send className="text-green-600 h-5 w-5" />
                <h3 className="font-semibold text-green-800">Send Notification</h3>
              </div>
              <button onClick={() => setIsSendModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {sendSuccess ? (
              <div className="p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-green-800">Notification Sent!</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Your notification has been sent successfully to students.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendNotification} className="p-5">
                <div className="space-y-5">
                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-green-800 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className="w-full px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Write your notification message here..."
                      value={newNotification.message}
                      onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                      required
                    ></textarea>
                  </div>
                  
                  {/* Type */}
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-green-800 mb-2">
                      Notification Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {notificationTypes.filter(t => t.id !== "all" && t.id !== "request").map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setNewNotification({...newNotification, type: type.id})}
                          className={`flex items-center gap-2 py-2 px-3 rounded-xl border ${
                            newNotification.type === type.id
                              ? `${type.color} border-current`
                              : "border-green-200 hover:bg-green-50"
                          }`}
                        >
                          <type.icon className="h-4 w-4" />
                          <span className="text-sm">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Submit button */}
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsSendModalOpen(false)}
                    className="mr-3 px-5 py-2 border border-green-200 text-green-700 rounded-xl hover:bg-green-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center gap-2"
                    disabled={
                      !newNotification.message
                    }
                  >
                    <Send className="h-4 w-4" />
                    Send
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}