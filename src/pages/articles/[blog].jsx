/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "../../../firebase/clientApp";
import { useRouter } from "next/router";

const themes = {
  crypto: "Крипта",
  economics: "Экономика",
  education: "Финансовая Грамотность",
};

export default function Details() {
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const theme = router.asPath.split("?")[1].split("=")[1];

      const res = await getDoc(doc(firestore, "blogs", String(theme)));
      const articles = res.data();

      setArticle(articles.data[router.asPath.split("?")[0].split("/")[2]]);
    };

    load();
  }, [router]);

  const [article, setArticle] = useState({
    image: "",
    header: "",
    body: [""],
    date: "",
    theme: "",
  });

  return (
    <div className="w-[100%] min-h-[80vh] mt-3 bg-[#5C5C5C] lg:py-20 py-16 px-3 lg:px-14 flex flex-col lg:gap-10 gap-5">
      <img
        src={article.image}
        alt="image"
        className="w-[95%] max-h-[70vh] mx-auto object-cover rounded-lg ring-2 ring-white"
      />
      <div className="ml-[2.5%] flex flex-col gap-7">
        <div className="flex flex-row gap-9">
          <p className="font-inter font-medium text-white text-xl text-start">
            {"Дата Выхода: " + article.date}
          </p>
          <p className="font-inter font-medium text-white text-xl text-start">
            {"Тема: " + themes[article.theme]}
          </p>
        </div>
        <h1 className="font-inter font-extrabold lg:text-4xl text-3xl text-[#FDC656] text-start underline underline-offset-8">
          {article.header}
        </h1>
      </div>
      <div className="flex flex-col gap-8">
        {article.body.map((item, index) => (
          <p
            key={index}
            className="font-inter font-medium text-white text-xl max-w-[95%] ml-[2.5%]"
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
