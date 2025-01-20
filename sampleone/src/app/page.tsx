import Image from "next/image";

export default function Home() {
  return (
  <div className="mx-auto mt-10 w-64">
   
   <form action="">
  <div>
    <label  className="block text-gray-800 font-semibold text-sm"
      >Email</label >
    <div className="mt-2">
      <input
        type="email"
        name="inputname"
        className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
      />
    </div>
    </div> 

    <div>
    <label  className="block text-gray-800 font-semibold text-sm"
      >Password</label >
    <div className="mt-2">
      <input
        type="password"
        name="inputname"
        className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
      />
    </div>
  </div>
  <button className="btn btn-neutral mt-5 w-56">submit</button>
  </form>

  <a href="/register" className="btn btn-active btn-link">Create Account</a>
    
  </div>
  );
}
