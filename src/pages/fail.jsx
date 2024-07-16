import { motion } from "framer-motion";
import { useRouter } from "next/router";

export default function Success() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3 mt-10 px-4 py-5 ring-2 ring-white lg:w-[58%] min-h-[40vh] mx-auto justify-center rounded-lg">
      <h2 className="font-inter font-bold text-[#FDC656] text-4xl text-center">
        Оплата не Прошла
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
        onClick={() => router.push("/#cost")}
        className="font-inter font-bold text-xl bg-[#FDC656] text-[#5C5C5C] py-4 px-14 rounded-xl mx-auto text-center mt-3"
      >
        Вернуться
      </motion.button>
    </div>
  );
}
