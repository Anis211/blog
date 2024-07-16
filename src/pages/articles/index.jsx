/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "../../../firebase/clientApp";

export default function All() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res1 = await getDoc(doc(firestore, "blogs", "crypto"));
      const crypto = res1.data();

      const res2 = await getDoc(doc(firestore, "blogs", "economics"));
      const economics = res2.data();

      const res3 = await getDoc(doc(firestore, "blogs", "education"));
      const education = res3.data();

      setArticles(crypto.data);
    };

    load();
  }, [setArticles]);

  return (
    <div className="w-[100%] min-h-[80vh] mt-3 bg-[#5C5C5C] lg:py-14 pb-16 px-14 flex flex-col lg:gap-20 gap-5">
      <h2 className="font-inter font-extrabold text-5xl text-[#FDC656] text-center">
        Все Наши Блоги
      </h2>
      <div className="flex flex-row flex-wrap gap-10 justify-evenly">
        {articles.length > 0
          ? articles.map((item, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 w-[90%] mx-auto lg:w-[28%] lg:mx-0"
              >
                <img
                  src={item.image}
                  alt="image"
                  className="w-full max-h-[50vh] rounded-xl ring-2 ring-white"
                />
                <p className="font-inter font-semibold text-white text-md">
                  {item.date}
                </p>
                <Link
                  href={`/articles/${articles.indexOf(item)}?theme=${
                    item.theme
                  }`}
                >
                  <h2 className="font-inter font-bold text-2xl text-[#FDC656] underline underline-offset-4">
                    {item.header}
                  </h2>
                </Link>
                <p className="font-inter font-semibold text-white text-lg">
                  {item.body.length >= 90
                    ? item.body.slice(0, 87) + "..."
                    : item.body}
                </p>
              </div>
            ))
          : ""}
      </div>
      <motion.button
        whileTap={{
          scale: 0.9,
          transition: { duration: 0.2, type: "spring" },
        }}
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.2, type: "spring" },
        }}
        className="bg-black px-6 py-4 w-[40%] mx-auto rounded-full font-inter font-medium text-xl text-white ring-2 ring-white"
      >
        Загрузить еще
      </motion.button>
    </div>
  );
}
