/* eslint-disable @next/next/no-img-element */

export default function About() {
  return (
    <div className="w-[100%] min-h-[80vh] mb-3 bg-[#5C5C5C] lg:py-14 py-16 lg:px-16 flex flex-col lg:flex-row gap-10 lg:gap-0 justify-between">
      <div className="lg:w-[40%] w-[90%] flex flex-col gap-8 my-auto mx-auto">
        <h2 className="font-inter font-extrabold lg:text-5xl text-4xl text-center text-[#FDC656]">
          О нашем Блоге
        </h2>
        <p className="font-inter font-medium lg:text-xl text-lg text-center text-white">
          Наш блог создан для тех, кто стремится взять свои финансы под контроль
          и достичь финансовой независимости. Мы предоставляем исчерпывающую
          информацию и полезные советы по всем аспектам управления деньгами — от
          личных финансов и инвестиций до экономических трендов и
          бизнес-стратегий.
        </p>
      </div>
      <div className="lg:w-[50%] w-[90%] mx-auto lg:mx-0">
        <img
          src="/about.webp"
          alt="about"
          className="w-[90%] mx-auto rounded-xl h-[100%] ring-2 ring-white object-cover"
        />
      </div>
    </div>
  );
}
