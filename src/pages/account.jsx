/* eslint-disable @next/next/no-img-element */
import { motion, AnimatePresence, useInView } from "framer-motion";
import { firestore } from "../../firebase/clientApp";
import { getDoc, doc, setDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/clientApp";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import useUser from "@/zustand/users";
import Link from "next/link";

const themes = {
  Крипта: "crypto",
  Экономика: "economics",
  Образование: "education",
};

export default function Account() {
  useEffect(() => {
    useUser.persist.rehydrate();
  }, []);

  const user = useUser((state) => state.user);
  const setUser = useUser((state) => state.setUser);
  const changeWeekly = useUser((state) => state.changeWeekly);

  const router = useRouter();
  const [cost, setCost] = useState([]);

  useEffect(() => {
    const decline = async () => {
      const res = await getDoc(doc(firestore, "users", "data"));
      const data = res.data();

      data.users[user.id].subscription.subsctibtion_date.time < Date.now()
        ? await setDoc(doc(collection(firestore, "users"), "data"), {
            users: {
              ...data.users,
              [user.id]: {
                ...data.users[user.id],
                subscription: {
                  subscribed: false,
                  weekly: true,
                },
              },
            },
          })
        : "";

      data.users[user.id].subscription.subsctibtion_date.time < Date.now()
        ? setUser({
            ...user,
            subscribed: false,
          })
        : "";
    };

    user.email != "admin@mail.ru" && user.subscribed == true ? decline() : "";
  }, [user, setUser]);

  useEffect(() => {
    user.weekly == false
      ? setCost([
          {
            name: "Пробная Неделя",
            cost: "49 тг",
            link: "https://auth.robokassa.kz/Merchant/Index.aspx?MerchantLogin=WILDBERRIES001&InvId=0&Culture=ru&Encoding=utf-8&OutSum=49&shp_interface=link&SignatureValue=0c53fb900fc1d3a19ddaa1716bb7fa53",
            month: false,
          },
          {
            name: "На месяц",
            cost: "1990 тг",
            link: "https://auth.robokassa.kz/Merchant/Index.aspx?MerchantLogin=WILDBERRIES001&InvId=0&Culture=ru&Encoding=utf-8&OutSum=1990&shp_interface=link&SignatureValue=769d9191673d53a3f3066233274a172a&Recurring=true",
            month: true,
          },
        ])
      : setCost([
          {
            name: "На месяц",
            cost: "1990 тг",
            link: "https://auth.robokassa.kz/Merchant/Index.aspx?MerchantLogin=WILDBERRIES001&InvId=0&Culture=ru&Encoding=utf-8&OutSum=1990&shp_interface=link&SignatureValue=769d9191673d53a3f3066233274a172a&Recurring=true",
            month: true,
          },
        ]);
  }, [user, cost]);

  const [articles, setArticles] = useState([]);
  const [articles1, setArticles1] = useState([]);
  const [data, setData] = useState([]);

  const [text, setText] = useState(
    user.subscribed == true ? "активна" : "не активна"
  );
  const [date, setDate] = useState("");

  useEffect(() => {
    setText(user.subscribed == true ? "активна" : "не активна");
  }, [user]);

  const [clicked1, setClicked1] = useState(false);

  const [header, setHeader] = useState("");
  const [body, setBody] = useState([]);
  const [image, setImage] = useState("");
  const [theme, setTheme] = useState("");

  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const [hidden, setHidden] = useState(true);
  const [hiddenTheme, setHiddenTheme] = useState(true);
  const [newBody, setNewBody] = useState("");

  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");

  const ref1 = useRef(null);
  const inView1 = useInView(ref1);

  const ref2 = useRef(null);
  const inView2 = useInView(ref2);

  const handleClick = async () => {
    const res = await getDoc(doc(firestore, "users", "data"));
    const data = res.data();

    const res1 = await getDoc(doc(firestore, "blogs", "crypto"));
    const crypto = res1.data();

    const res2 = await getDoc(doc(firestore, "blogs", "economics"));
    const economics = res2.data();

    const res3 = await getDoc(doc(firestore, "blogs", "education"));
    const education = res3.data();

    setData({
      crypto: crypto.data,
      economics: economics.data,
      education: education.data,
    });
    setArticles([...crypto.data, ...economics.data, ...education.data]);
    setArticles1(data.users[user.id].loved_articles);
  };

  const handleRevealDate = async () => {
    const res = await getDoc(doc(firestore, "users", "data"));
    const data = res.data();

    setDate(data.users[user.id].subscription.subsctibtion_date);
    setClicked1(true);
  };

  const handleAdd = async () => {
    try {
      const res = await getDoc(doc(firestore, "blogs", themes[theme]));
      const name = res.data();

      const storageRef = ref(storage);
      const fileRef = ref(
        storageRef,
        `images/blogs/${themes[theme]}/${image.name}`
      );

      let downloadUrl = "";

      await uploadBytes(fileRef, image);
      await getDownloadURL(fileRef).then((url) => {
        downloadUrl = url;
      });

      await setDoc(doc(collection(firestore, "blogs"), themes[theme]), {
        data: [
          ...name.data,
          {
            header: header,
            body: body,
            image: downloadUrl,
            theme: themes[theme],
            date: `${day < 10 ? "0" + day : day}.${
              month < 10 ? "0" + month : month
            }.${year}`,
          },
        ],
      });

      setIsSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    } catch (e) {
      setError(e.message);
      setIsError(true);
      setTimeout(() => setIsError(false), 5000);
    }
  };

  return user.email != "admin@mail.ru" ? (
    <div className="w-[100%] min-h-[50vh] lg:py-14 py-10">
      <h1 className="font-inter font-extrabold lg:text-5xl text-3xl lg:mx-0 text-center text-[#FDC656]">
        Добро Пожаловать, {user.login}{" "}
      </h1>
      <div className="lg:w-[80%] mx-auto w-full z-20 px-8 py-10 h-auto bg-[#5C5C5C] mt-[4%] text-start shadow-lg rounded-[16px]">
        <h2 className="font-inter font-semibold text-2xl text-white">
          Подписка:{" "}
          <span
            className={`${
              text == "активна" ? "text-[#4CAF50]" : "text-[#FF1744]"
            } underline underline-offset-4`}
          >
            {text}
          </span>
          {(text == "активна") & !clicked1 ? (
            <motion.button
              whileTap={{
                scale: 0.9,
                transition: { duration: 0.3, type: "spring" },
              }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3, type: "spring" },
              }}
              onClick={handleRevealDate}
              className="font-inter font-bold text-lg bg-[#FDC656] text-[#5C5C5C] ml-4 py-2 px-5 rounded-xl mx-auto  text-center mt-5"
            >
              Увидеть дату Окончания Подписки
            </motion.button>
          ) : (text == "активна") & clicked1 ? (
            <span className="text-lg ml-2">{` ( закончится ${
              date.day + "." + date.month + "." + date.year
            } )`}</span>
          ) : (
            ""
          )}
        </h2>
        {text == "не активна" ? (
          <div className="flex lg:flex-row flex-col gap-5 justify-between">
            <div className="flex flex-col gap-3 mt-10 px-4 py-5 ring-2 ring-white lg:w-[38%] justify-center rounded-lg">
              <h2 className="font-inter font-semibold text-[#FDC656] text-xl">
                Почему стоит оформить Подписку?
              </h2>
              {[
                "Актуальные знания и новости",
                "Эксклюзивный контент",
                "Обучающие материалы",
                "Экономия времени",
                "Поддержка авторов",
                "Персонализация контента",
              ].map((item, index) => (
                <div key={index} className="flex flex-row gap-1 items-center">
                  <div className="w-3 h-3 rounded-full bg-white" />
                  <p className="font-inter font-medium text-lg text-white">
                    {item}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-9 mt-10 px-4 py-5 ring-2 ring-white lg:w-[58%] justify-center rounded-lg">
              <h2 className="font-inter font-semibold text-[#FDC656] text-2xl text-center">
                Планы Подписки:
              </h2>
              <div className="flex lg:flex-row flex-col gap-6 lg:gap-0 justify-evenly w-[100%]">
                {cost.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 items-center justify-center lg:w-[45%] w-[90%] mx-auto lg:mx-0 px-3 py-10 ring-4 ring-white rounded-xl"
                  >
                    <Link href={item.link}>
                      <h2 className="font-inter font-bold text-2xl text-white text-center underline underline-offset-4">
                        {item.name}
                      </h2>
                    </Link>
                    <p className="font-inter font-bold text-xl text-[#4CAF50]">
                      {item.cost}
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
                      onClick={() => {
                        item.month == false
                          ? changeWeekly(true)
                          : changeWeekly(false);
                        router.push(item.link);
                      }}
                      className="font-inter font-bold text-xl bg-[#FDC656] text-[#5C5C5C] py-4 px-7 rounded-xl mx-auto w-[90%] text-center mt-3"
                    >
                      Оформить
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      {user.subscribed == true ? (
        <div className="lg:w-[80%] mx-auto w-full z-20 px-8 py-10 h-auto bg-[#5C5C5C] mt-[4%] text-start shadow-lg rounded-[16px]">
          <h1 className="font-inter font-extrabold text-3xl text-center text-[#FDC656]">
            Понравишиеся вам Блоги
          </h1>
          <div className="flex flex-row flex-wrap gap-6 justify-evenly pt-10">
            {articles1.length == 0 ? (
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
                className="font-inter font-bold text-xl bg-[#FDC656] text-[#5C5C5C] ml-4 py-4 px-8 rounded-xl self-center text-center mt-5"
              >
                Загрузить Понравившиеся Блоги
              </motion.button>
            ) : (
              articles1.map((item, index) => (
                <Link
                  key={index}
                  href={`/articles/${[
                    ...data[
                      articles[
                        [...articles.map((item1) => item1.header)].indexOf(item)
                      ].theme
                    ].map((item2) => item2.header),
                  ].indexOf(item)}?theme=${
                    articles[
                      [...articles.map((item3) => item3.header)].indexOf(item)
                    ].theme
                  }`}
                  className="font-inter font-semibold text-lg text-white underline underline-offset-4 lg:max-w-[30%] px-3 py-4 ring-2 ring-white rounded-xl"
                >
                  {item}
                </Link>
              ))
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  ) : (
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
          Вы Добавили Блог Успешно!
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
      <h1 className="font-inter font-extrabold text-5xl text-center w-[90%] mx-auto text-[#FDC656]">
        Добро Пожаловать, {user.login}{" "}
      </h1>
      <div className="lg:w-[80%] mx-auto w-full z-20 px-8 py-10 h-auto bg-[#5C5C5C] mt-[4%] flex flex-col gap-10 shadow-lg rounded-[16px]">
        <h1 className="font-inter font-extrabold lg:text-4xl text-3xl text-center text-white">
          Добавить Блог:
        </h1>
        <input
          type="text"
          value={header}
          placeholder="Добавить Зоголовок: "
          onChange={(e) => setHeader(e.target.value)}
          className="lg:w-[70%] w-[95%] rounded-lg py-5 px-8 mx-auto font-inter font-semibold text-gray-500 text-lg placeholder:font-inter placeholder:font-semibold placeholder:text-gray-500 placeholder:text-lg"
        />
        <div className="flex flex-col gap-5">
          <h2 className="font-inter font-bold text-white text-xl lg:ml-[15%]">
            Основная Часть Текста:
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
            className="w-[90%] lg:w-[20%] lg:ml-[15%] h-12 flex flex-row items-center justify-center gap-2 bg-[#FDC656] text-black rounded-md font-inter font-bold focus:shadow-lg hover:shadow-md"
            onClick={() => setHidden(false)}
          >
            Добавить Параграф{" "}
            <img src="/add.png" alt="add" className="w-9 h-9 my-auto" />
          </motion.button>
          <AnimatePresence>
            {!hidden ? (
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transtion={{ duration: 0.5, type: "spring" }}
                className="flex lg:flex-row flex-col lg:ml-[15%] gap-4"
              >
                <input
                  type="text"
                  value={newBody}
                  placeholder="Текст для Параграфа: "
                  onChange={(e) => setNewBody(e.target.value)}
                  className="lg:w-[70%] rounded-lg py-5 px-8 font-inter font-semibold text-gray-500 text-lg placeholder:font-inter placeholder:font-semibold placeholder:text-gray-500 placeholder:text-lg"
                />
                <div className="flex flex-col gap-1 lg:w-[20%]">
                  <motion.button
                    whileTap={{
                      scale: 0.9,
                      transition: { duration: 0.3, type: "spring" },
                    }}
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.3, type: "spring" },
                    }}
                    className="flex flex-row items-center justify-center gap-2 py-2 bg-[#FDC656] text-black rounded-md font-inter font-bold focus:shadow-lg hover:shadow-md"
                    onClick={() => {
                      setBody([...body, newBody]);
                      setNewBody("");
                      setHidden(true);
                    }}
                  >
                    Добавить
                  </motion.button>
                  <motion.button
                    whileTap={{
                      scale: 0.9,
                      transition: { duration: 0.3, type: "spring" },
                    }}
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.3, type: "spring" },
                    }}
                    className="flex flex-row items-center justify-center gap-2 py-2 bg-[#FDC656] text-black rounded-md font-inter font-bold focus:shadow-lg hover:shadow-md"
                    onClick={() => {
                      setNewBody("");
                      setHidden(true);
                    }}
                  >
                    Закрыть
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              ""
            )}
          </AnimatePresence>
          <AnimatePresence>
            {body.map((item, index) => (
              <motion.h3
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transtion={{ duration: 0.5, type: "spring" }}
                key={index}
                className="px-4 py-5 lg:w-[70%] w-full mx-auto ring-2 ring-white font-inter font-medium text-white text-lg rounded-lg flex flex-row justify-between"
              >
                {item}{" "}
                <img
                  src="/remove.png"
                  alt="remove"
                  className="w-11 h-11 my-auto"
                  onClick={() =>
                    setBody([
                      ...body.slice(0, body.indexOf(item)),
                      ...body.slice(body.indexOf(item) + 1, body.length),
                    ])
                  }
                />
              </motion.h3>
            ))}
          </AnimatePresence>
        </div>
        <div className="flex flex-col gap-5 lg:ml-[15%]">
          <h2 className="font-inter font-bold text-white text-xl">
            Добавить Картинку Блога:
          </h2>
          <input
            type="file"
            onChange={(e) =>
              e.target.files[0].name.includes(".png") ||
              e.target.files[0].name.includes(".jpg") ||
              e.target.files[0].name.includes(".jpeg") ||
              e.target.files[0].name.includes(".webp")
                ? setImage(e.target.files[0])
                : ""
            }
            className="file:font-inter file:font-semibold file:text-lg file:rounded-lg file:bg-[#FDC656] file:text-black file:px-4 file:py-2 text-white font-inter font-medium text-lg"
          />
        </div>
        <div className="flex flex-col gap-5 lg:ml-[15%]">
          <h2 className="font-inter font-bold text-[#FDC656] text-xl">
            Дата Выхода Блога:
          </h2>
          <h2 className="font-inter font-bold text-white text-lg">День:</h2>
          <input
            type="number"
            value={day}
            placeholder="День: "
            onChange={(e) =>
              e.target.value <= 31 ? setDay(e.target.value) : setDay(31)
            }
            className="lg:w-[40%] w-[95%] rounded-lg py-5 px-8 font-inter font-semibold text-gray-500 text-lg placeholder:font-inter placeholder:font-semibold placeholder:text-gray-500 placeholder:text-lg"
          />
          <h2 className="font-inter font-bold text-white text-lg">Месяц:</h2>
          <input
            type="number"
            value={month}
            placeholder="Месяц: "
            onChange={(e) =>
              e.target.value <= 12 ? setMonth(e.target.value) : setMonth(12)
            }
            className="lg:w-[40%] w-[95%] rounded-lg py-5 px-8 font-inter font-semibold text-gray-500 text-lg placeholder:font-inter placeholder:font-semibold placeholder:text-gray-500 placeholder:text-lg"
          />
          <h2 className="font-inter font-bold text-white text-lg">Год:</h2>
          <input
            type="number"
            value={year}
            placeholder="Год: "
            onChange={(e) => setYear(e.target.value)}
            className="lg:w-[40%] w-[95%] rounded-lg py-5 px-8 font-inter font-semibold text-gray-500 text-lg placeholder:font-inter placeholder:font-semibold placeholder:text-gray-500 placeholder:text-lg"
          />
        </div>
        <div className="flex flex-col gap-8 lg:ml-[15%]">
          <h2 className="font-inter font-bold text-[#FDC656] text-2xl">
            Тема Блога:
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
            className="w-[90%] lg:w-[20%] h-12 flex flex-row items-center justify-center gap-2 bg-[#FDC656] text-black rounded-md font-inter font-bold focus:shadow-lg hover:shadow-md"
            onClick={() => setHiddenTheme(false)}
          >
            Добавить Тему{" "}
            <img src="/add.png" alt="add" className="w-9 h-9 my-auto" />
          </motion.button>
          <AnimatePresence>
            {theme != "" ? (
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transtion={{ duration: 0.5, type: "spring" }}
                className="w-full lg:w-[20%] h-12 flex flex-row items-center justify-center gap-2 bg-[#FDC656] text-black rounded-md font-inter font-bold focus:shadow-lg hover:shadow-md"
              >
                {theme}
                <img
                  src="/remove.png"
                  alt="remove"
                  className="w-11 h-11 my-auto"
                  onClick={() => setTheme("")}
                />
              </motion.div>
            ) : (
              ""
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!hiddenTheme ? (
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transtion={{ duration: 0.5, type: "spring" }}
                className="flex lg:flex-row flex-col gap-3"
              >
                {["Крипта", "Экономика", "Образование"].map((item, index) => (
                  <motion.button
                    key={index}
                    whileTap={{
                      scale: 0.9,
                      transition: { duration: 0.3, type: "spring" },
                    }}
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.3, type: "spring" },
                    }}
                    className="w-full lg:w-[20%] h-12 flex flex-row items-center justify-center gap-2 bg-[#FDC656] text-black rounded-md font-inter font-bold focus:shadow-lg hover:shadow-md"
                    onClick={() => {
                      setTheme(item);
                      setHiddenTheme(true);
                    }}
                  >
                    {item}
                  </motion.button>
                ))}
                <motion.button
                  whileTap={{
                    scale: 0.9,
                    transition: { duration: 0.3, type: "spring" },
                  }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.3, type: "spring" },
                  }}
                  className="flex flex-row items-center justify-center gap-2 py-2 px-4 bg-[#FDC656] text-black rounded-md font-inter font-bold focus:shadow-lg hover:shadow-md"
                  onClick={() => {
                    setHiddenTheme(true);
                  }}
                >
                  Закрыть
                </motion.button>
              </motion.div>
            ) : (
              ""
            )}
          </AnimatePresence>
        </div>
        <motion.button
          whileTap={
            (header.length > 6) &
            (body.length > 0) &
            (image != "") &
            (date != "") &
            (month != "") &
            (year != "") &
            (theme.length != "")
              ? {
                  scale: 0.9,
                  transition: { duration: 0.3, type: "spring" },
                }
              : ""
          }
          whileHover={
            (header.length > 6) &
            (body.length > 0) &
            (image != "") &
            (date != "") &
            (month != "") &
            (year != "") &
            (theme.length != "")
              ? {
                  scale: 1.05,
                  transition: { duration: 0.3, type: "spring" },
                }
              : ""
          }
          className="flex flex-row items-center justify-center mt-3 w-[60%] mx-auto py-4 bg-[#FDC656] text-black text-xl rounded-md font-inter font-bold focus:shadow-lg hover:shadow-md disabled:opacity-65"
          disabled={
            (header.length > 6) &
            (body.length > 0) &
            (image != "") &
            (date != "") &
            (month != "") &
            (year != "") &
            (theme.length != "")
              ? false
              : true
          }
          onClick={handleAdd}
        >
          Добавить Блог
        </motion.button>
      </div>
    </div>
  );
}
