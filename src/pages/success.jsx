import { useEffect, useState } from "react";
import useUser from "@/zustand/users";
import { useRouter } from "next/router";
import { setDoc, doc, collection, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase/clientApp";
import { motion } from "framer-motion";

const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export default function Success() {
  useEffect(() => {
    useUser.persist.rehydrate();
  }, []);

  const weekly = useUser((state) => state.weekly);
  const user = useUser((state) => state.user);
  const setUser = useUser((state) => state.setUser);
  const router = useRouter();

  const today = new Date();
  let date =
    weekly == false
      ? {
          day: today.getDate(),
          month:
            today.getMonth() + 2 <= 12
              ? today.getMonth() + 2
              : today.getMonth() + 2 - 12,
          year:
            today.getMonth() + 2 <= 12
              ? today.getFullYear()
              : today.getFullYear() + 1,
        }
      : {
          time: today.getTime(),
          day:
            today.getDate() + 7 <= days[today.getMonth()]
              ? today.getDate() + 7
              : today.getDate() + 7 - days[today.getMonth()],
          month:
            today.getDate() + 7 > days[today.getMonth()] &&
            today.getMonth() + 2 < 12
              ? today.getMonth() + 2
              : today.getDate() + 7 > days[today.getMonth()] &&
                today.getMonth() + 2 > 12
              ? today.getMonth() + 2 - 12
              : today.getMonth() + 1,
          year:
            today.getDate() + 7 > days[today.getMonth()] &&
            today.getMonth() + 2 > 12
              ? today.getFullYear() + 1
              : today.getFullYear(),
        };

  const end = new Date(date.year, date.month, date.day);
  date = { ...date, time: end.getTime() };

  const handleClick = async () => {
    const res = await getDoc(doc(firestore, "users", "data"));
    const data = res.data();

    await setDoc(doc(collection(firestore, "users"), "data"), {
      users: {
        ...data.users,
        [user.id]: {
          ...data.users[user.id],
          subscription: {
            subscribed: true,
            weekly: true,
            subsctibtion_date: {
              day: date.day < 10 ? "0" + data.day : date.day,
              month: date.month < 10 ? "0" + date.month : date.month,
              year: date.year,
              time: date.time,
            },
          },
        },
      },
    });

    setUser({ ...user, subscribed: true, weekly: true });

    router.push("/account");
  };

  return (
    <div className="flex flex-col gap-3 mt-10 px-4 py-5 ring-2 ring-white lg:w-[58%] w-[95%] min-h-[40vh] mx-auto justify-center rounded-lg">
      <h2 className="font-inter font-bold text-[#FDC656] text-4xl text-center">
        Вы Успешно Оплатили Вашу Подписку
      </h2>
      <p className="font-inter font-semibold text-white text-lg text-center">
        {`Ваша Подписка Действует До ${
          date.day < 10 ? "0" + data.day : date.day
        }.${date.month < 10 ? "0" + date.month : date.month}.${date.year}`}
      </p>
      <motion.button
        whileTap={{
          scale: 0.9,
          transition: { duration: 0.3, type: "spring" },
        }}
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.3, type: "spring" },
        }}
        onClick={handleClick}
        className="font-inter font-bold text-xl bg-[#FDC656] text-[#5C5C5C] py-4 px-14 rounded-xl mx-auto text-center mt-3"
      >
        Готово
      </motion.button>
    </div>
  );
}
