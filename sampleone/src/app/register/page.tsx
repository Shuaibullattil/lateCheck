import Image from "next/image";

export default function Home() {
  return (
    <div className="mx-auto mt-10 w-64">
   
   <form action="">

    <div>
      <label  className="block text-gray-800 font-semibold text-sm"
        >Name</label >
      <div className="mt-2">
        <input
          type="text"
          name="name"
          className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 mb-3"
        />
      </div>
      </div> 

      <div>
      <label  className="block text-gray-800 font-semibold text-sm"
        >Mess ID:</label >
      <div className="mt-2">
        <input
          type="text"
          name="messid"
          className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800  mb-3"
        />
      </div>
    </div>

      <div>
      <label  className="block text-gray-800 font-semibold text-sm"
        >Phone No:</label >
      <div className="mt-2">
        <input
          type="text"
          name="phoneno"
          className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800  mb-3"
        />
      </div>
    </div>

    <div>
      <label  className="block text-gray-800 font-semibold text-sm"
        >Email:</label >
      <div className="mt-2">
        <input
          type="email"
          name="email"
          className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800  mb-3"
        />
      </div>
    </div>

    <div>
      <label  className="block text-gray-800 font-semibold text-sm"
        >Branch:</label >
      <div className="mt-2">
        <input
          type="text"
          name="branch"
          className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800  mb-3"
        />
      </div>
    </div>

    <div>
      <label  className="block text-gray-800 font-semibold text-sm"
        >year of study:</label >
      <div className="mt-2">
       <select name="year" id="" className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800  mb-3"> 
          <option value=""disabled selected>select the year</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
       </select>
       </div>
    </div>

    <div>
      <label  className="block text-gray-800 font-semibold text-sm"
        >Hostel</label >
      <div className="mt-2">
        <select name="hostel" id="" className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800  mb-3">
          <option value=""disabled selected>select the Hostel</option>
          <option value="swaraaj">Swaraaj Hostel</option>
          <option value="sahara">Sahara Hostel</option>
          <option value="siberia">Siberia Hostel</option>
        </select>
      </div>
    </div>
    


    <button className="btn btn-neutral mt-5 w-56">Register</button>
  </form>
    
  </div>
  );
}
