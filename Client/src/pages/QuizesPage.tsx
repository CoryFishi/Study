import { RiMenuFill } from "react-icons/ri";

function QuizesPage() {
  return (
    <div className="min-h-[calc(100vh-theme(space.16))] w-full bg-yellow-50 flex">
      <div className="w-5/6 p-5">
        <div className="w-full flex flex-col gap-2">
          <div>
            <div className="h-16 w-full bg-yellow-100 shadow rounded items-center flex px-10 justify-between cursor-pointer">
              <h2>YOUR QUIZES</h2>
              <RiMenuFill className="text-black" />
            </div>
            <div className="h-full border-x border-b rounded-b border-zinc-200 min-h-12 p-3">
              as
            </div>
          </div>
          <div>
            <div className="h-16 w-full bg-yellow-100 shadow rounded items-center flex px-10 justify-between cursor-pointer">
              <h2>ARCHIVED QUIZES</h2>
              <RiMenuFill className="text-black" />
            </div>
            <div className="h-full border-x border-b rounded-b border-zinc-200 min-h-12 p-3">
              as
            </div>
          </div>
          <div>
            <div className="h-16 w-full bg-yellow-100 shadow rounded items-center flex px-10 justify-between cursor-pointer">
              <h2>PUBLIC QUIZES</h2>
              <RiMenuFill className="text-black" />
            </div>
            <div className="h-full border-x border-b rounded-b border-zinc-200 min-h-12 p-3">
              as
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/6 py-5 pr-5">
        <div className="w-full flex flex-col h-full">
          <div className="h-16 w-full bg-yellow-100 shadow rounded items-center flex px-5 justify-between cursor-pointer">
            <h2>FILTERS</h2>
            <RiMenuFill className="text-black" />
          </div>
          <div className="h-full border-x border-b rounded-b border-zinc-200 p-3">
            as
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizesPage;
