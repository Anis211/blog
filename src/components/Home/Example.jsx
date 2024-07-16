/* eslint-disable @next/next/no-img-element */
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Example() {
  const router = useRouter();

  return (
    <div className="bg-[url('/back1.webp')] bg-cover w-[100%] lg:min-h-[90vh] gap-10 py-16 lg:px-10 lg:py-20 flex lg:flex-row flex-col items-end">
      <div className="lg:w-[60%] w-[90%] mx-auto lg:mx-0 flex flex-col gap-5">
        <Link href="/">
          <h2 className="font-inter font-bold lg:text-5xl text-3xl text-[#FDC656] underline underline-offset-4">
            Новый закон о криптовалютах появится в Турции
          </h2>
        </Link>
        <p className="font-inter font-medium lg:text-2xl text-lg text-white">
          Партия справедливости и развития вносит в парламент законопроект,
          соответствующий международным стандартам. Согласно новому закону,
          сделки с криптоактивами будут облагаться налогом. Об этом передает
          телеканал TGRT. Налоги придется платить, как при продаже, так при
          покупке валюты.
        </p>
      </div>
      <div className="flex flex-row gap-5 lg:mb-[7%] justify-end lg:w-[40%] w-[90%] mx-auto lg:mx-0">
        {[
          { icon: "/icon1.webp", text: "Скопировать" },
          { icon: "/icon2.webp", text: "Перейти" },
        ].map((item, index) => (
          <motion.button
            key={index}
            whileTap={{
              scale: 0.9,
              transition: { duration: 0.2, type: "spring" },
            }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2, type: "spring" },
            }}
            className="bg-[#FDC656] pl-5 pr-6 py-3 rounded-xl flex flex-row items-center gap-1 font-inter font-medium lg:text-xl text-lg text-black"
            onClick={() => router.push("/articles/0?theme=crypto")}
          >
            <img src={item.icon} alt="icon" className="lg:w-8 lg:h-8 w-6 h-6" />
            {item.text}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
