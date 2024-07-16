import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../firebase/clientApp";
import { doc, collection, setDoc, getDoc } from "firebase/firestore";
import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRouter } from "next/router";
import useUser from "@/zustand/users";
import Link from "next/link";

export default function SignUp() {
  useEffect(() => {
    useUser.persist.rehydrate();
  });

  const setUser = useUser((state) => state.setUser);
  const router = useRouter();

  const [email, setEmail] = useState(" ");
  const [login, setLogin] = useState(" ");

  const [password3, setPassword3] = useState("");
  const [password4, setPassword4] = useState("");

  const password1 = useRef(null);
  const password2 = useRef(null);

  const [isError1, setIsError1] = useState(false);
  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);

  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");

  const ref1 = useRef(null);
  const inView1 = useInView(ref1);

  const ref2 = useRef(null);
  const inView2 = useInView(ref2);

  const handleSubmit = async () => {
    try {
      await createUserWithEmailAndPassword(email, password4);

      const res = await getDoc(doc(firestore, "users", "data"));
      const data = res.data();

      const id = auth.currentUser.uid;

      await setDoc(doc(collection(firestore, "users"), "data"), {
        users: {
          ...data.users,
          [id]: {
            name: login,
            email: email,
            password: password4,
            loved_articles: [],
            subscription: {
              subcribed: false,
              weekly: false,
            },
          },
        },
      }).then(() => {
        setUser({
          login: login,
          id: id,
          subscribed: false,
          weekly: false,
        });

        setIsSuccess(true);
        setTimeout(() => router.push("/"), 1000);
      });
    } catch (e) {
      setError(e.message);
      setIsError(true);
      setTimeout(() => setIsError(false), 2000);
    }
  };

  return (
    <div className="w-[100%] min-h-[50vh] py-14">
      <motion.div
        ref={ref1}
        initial={{ opacity: 0, y: -60 }}
        animate={inView1 ? { opacity: [0, 0.5, 1], y: [-60, 0, 0] } : {}}
        transition={{ duration: 1, type: "spring", times: [0, 0.5, 1] }}
        className={`px-6 py-2 pt-3 rounded-lg bg-[#D1FAE5] h-[80px] ml-7 mt-7 absolute ${
          isSuccess ? "visible" : "hidden"
        }`}
      >
        <h2 className="font-lexend font-semibold text-[#047857] text-[20px]">
          Успех
        </h2>
        <p className="font-lexend font-semibold text-[#047857] text-[14px]">
          Вы успешно зарегистрировали ваш Аккаунт!
        </p>
      </motion.div>
      <motion.div
        ref={ref2}
        initial={{ opacity: 0, y: -60 }}
        animate={inView2 ? { opacity: [0, 0.5, 1], y: [-60, 0, 0] } : {}}
        exit={{ opacity: [1, 0.5, 0], y: [0, -60, -60] }}
        transition={{ duration: 1, type: "spring", times: [0, 0.5, 1] }}
        className={`px-6 py-2 pt-3 rounded-lg bg-red-400 h-[80px] ml-7 mt-7 absolute ${
          isError ? "visible" : "hidden"
        } `}
      >
        <h2 className="font-lexend font-semibold text-gray-50 text-[20px]">
          Ошибка
        </h2>
        <p className="font-lexend font-semibold text-gray-50 text-[14px]">
          {error}
        </p>
      </motion.div>
      <div className="lg:w-[35%] w-full z-20 h-auto lg:px-8 lg:pl-12 pt-10 pb-14 lg:self-center lg:mx-auto bg-[#5C5C5C] mt-[4%] text-center shadow-lg rounded-[16px]">
        <h2 className="font-inter font-extrabold text-3xl text-[#FDC656] text-center mb-1 underline underline-offset-8">
          Регистрация
        </h2>
        <p className="font-inter font-semibold text-md text-[#FDC656] text-center mb-4 mt-5">
          Введите Ваш Будущий Логин
        </p>
        <input
          type="text"
          placeholder="Ваш Логин: "
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          className="lg:w-80 w-[90%] h-12 rounded-lg mb-[15px] pl-[10px] focus:shadow-lg hover:shadow-md"
        />
        <input
          type="email"
          placeholder="Ваша Почта: "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`lg:w-80 w-[90%] h-12 rounded-lg mb-[15px] pl-[10px] focus:shadow-lg hover:shadow-md`}
        />
        <input
          ref={password1}
          type="text"
          value={password3}
          placeholder="Ваш Пороль: "
          className={`lg:w-80 w-[90%] h-12 rounded-lg mb-[15px] pl-[10px] focus:shadow-lg hover:shadow-md ${
            isError1 ? "ring-red-500 ring-offset-1 ring-[2px]" : ""
          }`}
          onChange={(e) => setPassword3(e.target.value)}
        />
        <input
          ref={password2}
          type="text"
          value={password4}
          placeholder="Подтвердите Ваш Пороль: "
          className={`lg:w-80 w-[90%] h-12 rounded-lg mb-[25px] pl-[10px] focus:shadow-lg hover:shadow-md ${
            isError1 ? "ring-red-500 ring-offset-1 ring-[2px]" : ""
          }`}
          onChange={(e) => setPassword4(e.target.value)}
          onBlur={(event) => {
            event.target.value == password1.current.value
              ? setIsError1(false)
              : setIsError1(true);
          }}
        />
        <motion.button
          whileTap={{
            scale: 0.9,
            transition: { duration: 0.3, type: "spring" },
          }}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.3, type: "spring" },
          }}
          className="2xl:w-80 w-[90%] md:w-[80%] lg:w-[70%] h-12 bg-[#FDC656] text-[#5C5C5C] rounded-md font-inter font-bold focus:shadow-lg hover:shadow-md"
          onClick={handleSubmit}
        >
          Зарегистрироваться
        </motion.button>
        <p className="font-inter font-medium text-[#FDC656] text-sm mt-4">
          Если вы уже Зарегистрированны,
          <Link href="/sign-in">
            <span>{" ' нажмите сюда '"}</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
