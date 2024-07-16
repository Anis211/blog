/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import useUser from "@/zustand/users";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/clientApp";
import { useRouter } from "next/router";

export default function Navbar() {
  useEffect(() => {
    useUser.persist.rehydrate();
  }, []);

  const router = useRouter();
  const user = useUser((state) => state.user);
  const clearUser = useUser((state) => state.clearUser);

  const [sidebar, setSidebar] = useState(false);
  const [hidden, setHidden] = useState(false);
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
    <div className="bg-[#404040] flex flex-col gap-3 py-5">
      {(hidden == false && user.subscribed == false) ||
      (hidden == false && user.subscribed == undefined) ? (
        <div className="w-[95%] hidden mx-auto bg-[#333333] py-3 px-6 lg:flex justify-between items-center rounded-full">
          <h2 className="font-inter font-bold lg:text-lg text-white flex flex-row justify-center ml-[5%] w-[90%]">
            Чтобы знать всё об экономике и риазвитии рынка,
            <Link
              href={user.email != undefined ? "/#cost" : "/sign-up"}
              className="text-[#FDC656] flex flex-col"
            >
              {" "}
              подпишитесь на наш Блог.
              <div className="border-b-2 border-b-white w-[100%]" />
            </Link>
          </h2>
          <img
            src="/close.webp"
            alt="close"
            className="w-9 h-9"
            onClick={() => setHidden(true)}
          />
        </div>
      ) : (
        ""
      )}
      <div className="w-[95%] mx-auto bg-white ring-2 ring-black py-4 px-10 flex flex-row justify-between items-center rounded-full">
        <h2 className="font-inter font-extrabold text-2xl text-black">
          ASJ-TAB
        </h2>
        <div className="hidden lg:flex flex-row gap-8">
          {links.map((item, index) => (
            <Link key={index} href={item.link}>
              <h2 className="font-inter font-bold text-xl">{item.name}</h2>
            </Link>
          ))}
        </div>

        {user.name == "incognito" ? (
          <div className="hidden lg:flex flex-row gap-3 font-inter font-bold text-black text-xl">
            <Link href="/sign-up">Зарегистрироваться</Link>
            <div className="border-r-2 border-r-black h-[3.5vh] rotate-12" />
            <Link href="/sign-in">Войти</Link>
          </div>
        ) : (user.name != "incognito") & !router.asPath.includes("account") ? (
          <Link
            href="/account"
            className="hidden lg:flex flex-row gap-1 items-center font-inter font-bold text-black text-xl"
          >
            Аккаунт
            <img src="/user.png" alt="user" className="w-10 h-10" />
          </Link>
        ) : (
          <button
            onClick={() => {
              signOut(auth);
              clearUser();
              router.push("/");
            }}
            className="hidden lg:flex"
          >
            <h2 className="font-inter font-bold text-black text-xl">
              Выйти из Аккаунта
            </h2>
          </button>
        )}
        <AnimatePresence>
          {sidebar ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="bg-[#404040] z-[6] flex flex-col text-white gap-5 place-items-center justify-center absolute left-0 top-0 w-[100vw] h-[100vh]"
              onClick={() => setSidebar(false)}
            >
              {[
                ...links,
                user.name == "incognito"
                  ? { name: "Зарегистрироваться", link: "/sign-up" }
                  : (user.name != "incognito") &
                    !router.asPath.includes("account")
                  ? { name: "Аккаунт", link: "/account" }
                  : {
                      name: "Выйти из Аккаунта",
                      link: () => {},
                    },
                user.name == "incognito"
                  ? { name: "Войти", link: "/sign-in" }
                  : "",
              ].map((item, index) => (
                <div key={index} className="w-[60%]">
                  <h2
                    className="font-poppins font-medium text-xl mx-auto text-center"
                    onClick={
                      typeof item.link == "string"
                        ? () => {
                            router.push(item.link);
                            setSidebar(false);
                          }
                        : () => {
                            signOut(auth);
                            clearUser();
                            router.push("/");
                            setSidebar(false);
                          }
                    }
                  >
                    {item.name}
                  </h2>
                  <div className="border-b-2 border-b-gray-200 mt-4" />
                </div>
              ))}
            </motion.div>
          ) : (
            ""
          )}
        </AnimatePresence>
        <div className="px-4 py-4 w-16 h-16 my-auto bg-[#FFC858] rounded-full lg:hidden flex ">
          <img
            alt="more"
            src="/more.png"
            className="w-8 h-8 self-center"
            onClick={() => setSidebar(true)}
          />
        </div>
      </div>
    </div>
  );
}
