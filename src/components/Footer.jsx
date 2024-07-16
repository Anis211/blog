/* eslint-disable @next/next/no-img-element */
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import useUser from "@/zustand/users";

export default function Footer() {
  useEffect(() => {
    useUser.persist.rehydrate();
  }, []);

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const router = useRouter();
  const user = useUser((state) => state.user);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    user.subscribed == false || user.subscribed == undefined
      ? setLinks([
          { name: "Главная", link: "/" },
          { name: "О Блоге", link: "/#about" },
          { name: "Цены", link: "/#cost" },
        ])
      : setLinks([
          { name: "Главная", link: "/" },
          { name: "О Блоге", link: "/#about" },
        ]);
  }, [user]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : ""}
      transition={{
        duration: 0.8,
        type: "spring",
        staggerChildren: 0.2,
        delayChildren: 0.6,
      }}
      className="w-[100%] min-h-[40vh] lg:py-16 py-10 mt-3 flex flex-col lg:flex-row justify-evenly"
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 60 },
          visible: { opacity: 1, y: 0 },
        }}
        className="flex flex-col gap-10 lg:w-[22%] w-[90%] mx-auto lg:mx-0 mt-10"
      >
        <h2 className="font-inter font-extrabold text-4xl text-[#FDC656]">
          ASJ-TAB
        </h2>
        <p className="font-inter font-medium text-white text-md text-start relative bottom-5">
          Все Интересные События, Происходящие в Мире Денег Смотрите Тут.
        </p>
        <Link href={"https://docs.robokassa.kz/media/dogobor_plat.pdf"}>
          <p className="font-inter font-medium text-[#FDC656] text-md text-start relative bottom-10 underline">
            Договор Оферты и Политика Конфендициальности
          </p>
        </Link>
      </motion.div>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 60 },
          visible: { opacity: 1, y: 0 },
        }}
        className="flex flex-col gap-2"
      >
        <h2 className="font-inter font-semibold text-[#FDC656] text-xl text-center lg:mt-10 mt-6">
          Навигация
        </h2>
        {links.map((item, index) => (
          <Link key={index} href={item.link}>
            <p className="font-inter font-medium text-white text-lg text-center lg:text-start">
              {item.name}
            </p>
          </Link>
        ))}
      </motion.div>
      {user.subscribed == false || user.subscribed == undefined ? (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 60 },
            visible: { opacity: 1, y: 0 },
          }}
          className="flex flex-col gap-2"
        >
          <h2 className="font-inter font-semibold text-[#FDC656] text-xl text-center mt-10">
            Оформить Подписку
          </h2>
          <motion.button
            whileTap={{
              scale: 0.9,
              transition: { duration: 0.3, type: "spring" },
            }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3, type: "spring" },
            }}
            onClick={() =>
              user.email != undefined
                ? router.push("/#cost")
                : router.push("/sign-up")
            }
            className="font-inter font-bold text-xl bg-[#FDC656] text-[#5C5C5C] py-4 px-14 rounded-xl mx-auto  text-center mt-5"
          >
            Оформить
          </motion.button>
        </motion.div>
      ) : (
        ""
      )}
    </motion.div>
  );
}
