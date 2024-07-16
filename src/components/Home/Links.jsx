/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getDoc, doc, setDoc, collection } from "firebase/firestore";
import { firestore } from "../../../firebase/clientApp";
import useUser from "@/zustand/users";
import { useRouter } from "next/router";

export default function Links({ inView }) {
  useEffect(() => {
    inView ? load() : "";
  }, [inView]);

  useEffect(() => {
    useUser.persist.rehydrate();
  }, []);

  const [maximum, setMaximum] = useState(3);
  const [articles, setArticles] = useState([]);
  const [data, setData] = useState([]);

  const router = useRouter();
  const user = useUser((state) => state.user);
  const setUser = useUser((state) => state.setUser);

  const load = async () => {
    const res = await getDoc(doc(firestore, "blogs", "crypto"));
    const crypto = res.data();

    const res1 = await getDoc(doc(firestore, "blogs", "economics"));
    const economics = res1.data();

    const res2 = await getDoc(doc(firestore, "blogs", "education"));
    const education = res2.data();

    setData({
      crypto: [...crypto.data],
      economics: [...economics.data],
      education: [...education.data],
    });
    setArticles([...crypto.data, ...economics.data, ...education.data]);
  };

  const handleChange = async (header) => {
    setUser({
      ...user,
      liked: !user.liked.includes(header)
        ? [...user.liked, header]
        : [
            ...user.liked.slice(0, user.liked.indexOf(header)),
            ...user.liked.slice(
              user.liked.indexOf(header) + 1,
              user.liked.length
            ),
          ],
    });

    const res = await getDoc(doc(firestore, "users", "data"));
    const data = res.data();

    await setDoc(doc(collection(firestore, "users"), "data"), {
      users: {
        ...data.users,
        [user.id]: {
          ...data.users[user.id],
          loved_articles: !data.users[user.id].loved_articles.includes(header)
            ? [...data.users[user.id].loved_articles, header]
            : [
                ...data.users[user.id].loved_articles.slice(
                  0,
                  data.users[user.id].loved_articles.indexOf(header)
                ),
                ...data.users[user.id].loved_articles.slice(
                  data.users[user.id].loved_articles.indexOf(header) + 1,
                  data.users[user.id].loved_articles.length
                ),
              ],
        },
      },
    });
  };

  return (
    <div className="w-[100%] min-h-[80vh] mt-3 bg-[#5C5C5C] lg:py-14 py-16 lg:px-14 flex flex-col lg:gap-20 gap-5">
      <h2 className="font-inter font-extrabold lg:text-5xl text-3xl text-[#FDC656] text-center">
        Все Наши Блоги
      </h2>
      <div className="flex flex-row flex-wrap gap-10 justify-evenly">
        {articles.length > 0
          ? articles.slice(0, maximum).map((item, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 w-[90%] mx-auto lg:w-[28%] lg:mx-0"
              >
                <div className="flex flex-col">
                  <img
                    src={item.image}
                    alt="image"
                    className="w-full h-[30vh] object-cover rounded-xl ring-2 ring-white"
                    onClick={() => handleChange(item.header)}
                  />
                  {user.email != "admin@mail.ru" && user.subscribed == true ? (
                    <img
                      src={
                        !user.liked?.includes(item.header)
                          ? "/heartOutlined.webp"
                          : "/heartFilled.webp"
                      }
                      alt="heart"
                      className="w-8 h-8 relative bottom-10 left-[90%]"
                    />
                  ) : (
                    ""
                  )}
                </div>
                <p className="font-inter font-semibold text-white text-md">
                  {item.date}
                </p>
                <Link
                  href={`/articles/${data[item.theme].indexOf(item)}?theme=${
                    item.theme
                  }`}
                >
                  <h2 className="font-inter font-bold text-2xl text-[#FDC656] underline underline-offset-4">
                    {item.header}
                  </h2>
                </Link>
                <p className="font-inter font-semibold text-white text-lg">
                  {item.body[0].length >= 90
                    ? item.body[0].slice(0, 87) + "..."
                    : item.body[0]}
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
        className="bg-black px-6 py-4 lg:w-[40%] w-[90%] mx-auto rounded-full font-inter font-medium text-xl text-white ring-2 ring-white"
        onClick={() => {
          if (user.subscribed == true) {
            if (articles.length - maximum > 3) {
              setMaximum(maximum + 3);
            } else {
              setMaximum(articles.length);
            }
          } else {
            router.push("/#cost");
          }
        }}
      >
        Загрузить еще
      </motion.button>
    </div>
  );
}
