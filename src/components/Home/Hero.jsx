import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useUser from "@/zustand/users";
import { useRouter } from "next/router";

export default function Hero() {
  useEffect(() => {
    useUser.persist.rehydrate();
  }, []);

  const router = useRouter();

  const user = useUser((state) => state.user);
  const [email, setEmail] = useState("");

  return (
    <div className="bg-transparent flex flex-col gap-12 lg:py-28 py-16">
      <div className="flex flex-col gap-5">
        <h1 className="font-inter font-extrabold lg:text-5xl text-3xl text-[#FDC656] text-center w-[70%] mx-auto">
          Все Интересные События, Происходящие в Мире Денег Смотрите Тут.
        </h1>
        {user.subscribed == false || user.subscribed == undefined ? (
          <p className="font-inter font-medium lg:text-xl text-lg text-white text-center">
            Поторопитесь вступить, пока у нас действуют сидки!
          </p>
        ) : (
          <p className="font-inter font-medium lg:text-xl text-lg text-white text-center">
            Самые интересные и свежие новости их сферы экономики для
            подписавшихся.
          </p>
        )}
      </div>
      {user.subscribed == false || user.subscribed == undefined ? (
        <div className="flex lg:flex-row flex-col gap-4 justify-center lg:w-[50%] mx-auto">
          <input
            type="email"
            placeholder="Ваша Почта"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-7 py-4 lg:min-w-[50%] min-w-[95%] max-w-[95%] mx-auto bg-white rounded-full font-inter font-regular text-[#6C6C6C] text-xl placeholder:font-inter placeholder:font-regular placeholder:text-[#6C6C6C] placeholder:text-xl"
          />
          <motion.button
            whileTap={{
              scale: 0.9,
              transition: { duration: 0.2, type: "spring" },
            }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2, type: "spring" },
            }}
            className="bg-[#FDC656] w-[95%] lg:w-[40%] mx-auto lg:mx-0 px-6 py-4 rounded-full font-inter font-medium text-xl text-[#5C5C5C]"
            onClick={() =>
              user.email != undefined
                ? router.push("/#cost")
                : router.push("/sign-up")
            }
          >
            Подписаться
          </motion.button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
