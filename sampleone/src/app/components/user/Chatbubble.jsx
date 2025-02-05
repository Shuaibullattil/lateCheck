import React from 'react'

const Chatbubble = () => {
  return (
    <div>
        <div className="chat chat-start">
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                <img
                    alt="Tailwind CSS chat bubble component"
                    src="https://i.pinimg.com/236x/77/fa/9b/77fa9bfc168777170a09102afda216b6.jpg" />
                </div>
            </div>
            <div className="chat-header pl-2 text-sm font-medium text-gray-500">
                20:37
            </div>
            <div className="chat-bubble">Late entries have increased recently. Please follow hostel timings strictly. Repeated late entries without valid reasons may lead to action. Inform in advance if necessary.</div>
           
        </div>
        <div className="chat chat-start">
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                <img
                    alt="Tailwind CSS chat bubble component"
                    src="https://i.pinimg.com/236x/77/fa/9b/77fa9bfc168777170a09102afda216b6.jpg" />
                </div>
            </div>
            <div className="chat-header pl-2 text-sm font-medium text-gray-500">
                22:15
            </div>
            <div className="chat-bubble">Mess closing time has been changed from 10:30 PM to 11:00 PM. Please plan accordingly.</div>
           
        </div>
    </div>
  )
}

export default Chatbubble