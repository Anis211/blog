import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import useUser from "@/zustand/users";
import { useEffect, useState } from "react";

export default function Cost() {
  useEffect(() => {
    useUser.persist.rehydrate();
  }, []);

  const user = useUser((state) => state.user);

  return (
    <div className="w-[100%] my-3 lg:py-14 py-16 lg:px-16 flex flex-col gap-10 justify-center">
      <h1 className="font-inter font-extrabold text-[#FDC656] lg:text-5xl text-3xl text-center">
        Наши Расценки
      </h1>
      <div className="flex lg:flex-row flex-col gap-6 lg:gap-0 justify-evenly w-[100%]">
        <div className="flex flex-col gap-2 items-center justify-center lg:w-[30%] w-[90%] mx-auto lg:mx-0 px-3 py-10 ring-4 ring-white rounded-xl">
          <h2 className="font-inter font-bold text-2xl text-white underline underline-offset-4">
            На Месяц
          </h2>
          <p className="font-inter font-bold text-xl text-[#4CAF50]">1990 тг</p>
          <form
            method="POST"
            action="https://auth.robokassa.ru/Merchant/Index.aspx"
          >
            <input type="hidden" name="MerchantLogin" value="WILDBERRIES001" />
            <input type="hidden" name="InvoiceID" value="154" />
            <input type="hidden" name="Description" value="Оплата подписки" />
            <input
              type="hidden"
              name="SignatureValue"
              value={"a0df24639333d0632b51a75bf09fa115"}
            />
            <input type="hidden" name="OutSum" value="49" />
            <input type="hidden" name="Recurring" value="true" />
            <motion.input
              whileTap={{
                scale: 0.9,
                transition: { duration: 0.3, type: "spring" },
              }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3, type: "spring" },
              }}
              type="submit"
              value="Оплатить"
              className="font-inter font-bold text-xl bg-[#FDC656] text-[#5C5C5C] py-4 px-7 rounded-xl mx-auto text-center mt-3"
            />
          </form>
          <form
            method="POST"
            action="https://auth.robokassa.ru/Merchant/Recurring"
          >
            <input type="hidden" name="MerchantLogin" value="WILDBERRIES001" />
            <input type="hidden" name="InvoiceID" value="156" />
            <input type="hidden" name="PreviousInvoiceID" value="154" />
            <input type="hidden" name="Description" value="Оплата подписки" />
            <input
              type="hidden"
              name="SignatureValue"
              value="0185687e8624c29220a2dd3d4758b6e7"
            />
            <input type="hidden" name="OutSum" value="49" />
            <input type="submit" value="Повторить оплату" />
          </form>
        </div>
      </div>
    </div>
  );
}
