--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Blog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Blog" (
    id integer NOT NULL,
    name text NOT NULL,
    "photoName" text,
    "contentPath" text,
    "contentSize" integer,
    "contentHash" text,
    "userId" integer NOT NULL,
    "specializationId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Blog" OWNER TO postgres;

--
-- Name: Blog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Blog_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Blog_id_seq" OWNER TO postgres;

--
-- Name: Blog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Blog_id_seq" OWNED BY public."Blog".id;


--
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: Category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Category_id_seq" OWNER TO postgres;

--
-- Name: Category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;


--
-- Name: Message; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Message" (
    id integer NOT NULL,
    content text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "senderId" integer NOT NULL,
    "receiverId" integer NOT NULL,
    "filePath" text,
    "isRead" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Message" OWNER TO postgres;

--
-- Name: Message_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Message_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Message_id_seq" OWNER TO postgres;

--
-- Name: Message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Message_id_seq" OWNED BY public."Message".id;


--
-- Name: Payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Payment" (
    id integer NOT NULL,
    amount double precision NOT NULL,
    purpose text NOT NULL,
    "orderId" text NOT NULL,
    "userId" integer NOT NULL,
    "operationId" text NOT NULL,
    "externalPaymentId" text,
    "paymentLink" text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Payment" OWNER TO postgres;

--
-- Name: Payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Payment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Payment_id_seq" OWNER TO postgres;

--
-- Name: Payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Payment_id_seq" OWNED BY public."Payment".id;


--
-- Name: Specialization; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Specialization" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Specialization" OWNER TO postgres;

--
-- Name: Specialization_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Specialization_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Specialization_id_seq" OWNER TO postgres;

--
-- Name: Specialization_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Specialization_id_seq" OWNED BY public."Specialization".id;


--
-- Name: Subscription; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Subscription" (
    id integer NOT NULL,
    name text NOT NULL,
    "ratingBoost" integer,
    duration integer DEFAULT 30 NOT NULL,
    features text[],
    price numeric(65,30) DEFAULT 0 NOT NULL,
    "isDefault" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."Subscription" OWNER TO postgres;

--
-- Name: Subscription_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Subscription_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Subscription_id_seq" OWNER TO postgres;

--
-- Name: Subscription_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Subscription_id_seq" OWNED BY public."Subscription".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    login text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "refreshToken" text,
    "isEmailVerified" boolean DEFAULT false NOT NULL,
    "isResetVerified" boolean DEFAULT false NOT NULL,
    "logoFileName" text,
    "fullName" text,
    city text,
    about text,
    level text,
    "phoneNumber" text,
    telegram text,
    vk text,
    website text,
    experience text,
    "coverFileName" text,
    "joinAuthorsNotifications" boolean DEFAULT false NOT NULL,
    "weeklySummaryNotifications" boolean DEFAULT false NOT NULL,
    "rewardNotifications" boolean DEFAULT false NOT NULL,
    "lastLoginUpdate" timestamp(3) without time zone,
    "blogId" integer,
    "subscriptionId" integer DEFAULT 1 NOT NULL,
    status text DEFAULT 'offline'::text NOT NULL,
    "subscriptionEndAt" timestamp(3) without time zone,
    "subscriptionStartAt" timestamp(3) without time zone
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _BlogLikes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_BlogLikes" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_BlogLikes" OWNER TO postgres;

--
-- Name: _BlogViews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_BlogViews" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_BlogViews" OWNER TO postgres;

--
-- Name: _ProjectLikes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_ProjectLikes" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_ProjectLikes" OWNER TO postgres;

--
-- Name: _ProjectViews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_ProjectViews" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_ProjectViews" OWNER TO postgres;

--
-- Name: _User Specializations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_User Specializations" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_User Specializations" OWNER TO postgres;

--
-- Name: _UserFollows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_UserFollows" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_UserFollows" OWNER TO postgres;

--
-- Name: _UserLikes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_UserLikes" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_UserLikes" OWNER TO postgres;

--
-- Name: _UserStarred; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_UserStarred" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_UserStarred" OWNER TO postgres;

--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    "photoName" text,
    "firstLink" text,
    "secondLink" text,
    "categoryId" integer NOT NULL,
    "userId" integer NOT NULL,
    "specializationId" integer NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "contentHash" text,
    "contentPath" text,
    "contentSize" integer
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_id_seq OWNER TO postgres;

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: Blog id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Blog" ALTER COLUMN id SET DEFAULT nextval('public."Blog_id_seq"'::regclass);


--
-- Name: Category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);


--
-- Name: Message id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message" ALTER COLUMN id SET DEFAULT nextval('public."Message_id_seq"'::regclass);


--
-- Name: Payment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment" ALTER COLUMN id SET DEFAULT nextval('public."Payment_id_seq"'::regclass);


--
-- Name: Specialization id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Specialization" ALTER COLUMN id SET DEFAULT nextval('public."Specialization_id_seq"'::regclass);


--
-- Name: Subscription id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subscription" ALTER COLUMN id SET DEFAULT nextval('public."Subscription_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Data for Name: Blog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Blog" (id, name, "photoName", "contentPath", "contentSize", "contentHash", "userId", "specializationId", "createdAt", "updatedAt") FROM stdin;
78	SMM в 2025: Переход от вирального контента к стратегии роста. Пошаговое руководство	1758708361323-915051351.jpg	blog_78.json	13172	904a0992e669f70b7f0d4d24fcb336094066557b90e1e03554a44e453fdd5803	51	1	2025-09-24 10:06:02.366	2025-09-24 10:06:02.448
45	Как ускорить работу сайта на Tilda	1758455809606-398488944.png	blog_45.json	970156	2da727c55d5a5bdb719e81486ee83fb13d65995436a25333628d9755759ae380	18	5	2025-09-21 11:56:49.681	2025-09-26 10:13:51.488
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, name) FROM stdin;
3	Медицина
4	Строительные инструменты
5	Продукты питания
6	Товары для дома
7	Одежда и аксессуары
8	Специализированные услуги
9	Образование и досуг
10	Красота и здоровье
11	Общественное питание
12	Big Data и аналитика
13	Искусственный интеллект
14	Финтех и платежи
15	Образовательные технологии
16	Товары для бизнеса
17	Локальное производство
18	Ниши с особыми условиями
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Message" (id, content, "createdAt", "senderId", "receiverId", "filePath", "isRead") FROM stdin;
138	лупа	2025-10-08 11:34:47.271	18	183	\N	f
171	Тест	2025-10-12 21:23:41.273	18	283	\N	f
172	ку	2025-10-12 21:24:24.485	283	18	\N	f
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Payment" (id, amount, purpose, "orderId", "userId", "operationId", "externalPaymentId", "paymentLink", status, "expiresAt", "createdAt", "updatedAt") FROM stdin;
11	1200	Оплата подписки: pro	sub_2_user_18_1758135242768	18	00c5915f-7791-4fda-8adb-a364c4c78aa4	\N	https://merch.tochka.com/order/?uuid=00c5915f-7791-4fda-8adb-a364c4c78aa4	pending	2025-09-24 18:54:03.351	2025-09-17 18:54:03.353	2025-09-17 18:54:03.353
44	1200	Оплата подписки: pro	sub_2_user_613_1760179743338	613	19fb2af7-e757-4dc3-97d4-05d0d63cca8b	\N	https://merch.tochka.com/order/?uuid=19fb2af7-e757-4dc3-97d4-05d0d63cca8b	pending	2025-10-18 10:49:03.931	2025-10-11 10:49:03.932	2025-10-11 10:49:03.932
77	2000	Оплата подписки: premium	sub_3_user_646_1760271773865	646	1401694d-9abc-4f8d-81fd-d4cda1b36e10	\N	https://merch.tochka.com/order/?uuid=1401694d-9abc-4f8d-81fd-d4cda1b36e10	pending	2025-10-19 12:22:54.381	2025-10-12 12:22:54.382	2025-10-12 12:22:54.382
\.


--
-- Data for Name: Specialization; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Specialization" (id, name) FROM stdin;
1	SMM
3	Контент менеджмент
4	Крауд маркетинг
5	Маркетинг
2	Таргет
6	Контекстная реклама
\.


--
-- Data for Name: Subscription; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Subscription" (id, name, "ratingBoost", duration, features, price, "isDefault") FROM stdin;
1	default	0	30	\N	0.000000000000000000000000000000	t
2	pro	10	30	\N	1200.000000000000000000000000000000	f
3	premium	20	30	\N	2000.000000000000000000000000000000	f
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, login, email, password, "createdAt", "updatedAt", "refreshToken", "isEmailVerified", "isResetVerified", "logoFileName", "fullName", city, about, level, "phoneNumber", telegram, vk, website, experience, "coverFileName", "joinAuthorsNotifications", "weeklySummaryNotifications", "rewardNotifications", "lastLoginUpdate", "blogId", "subscriptionId", status, "subscriptionEndAt", "subscriptionStartAt") FROM stdin;
84	Younni	yummy022007@gmail.com	$2b$10$zMvCMGjLn4cL44uekjb7zOFhsR9k0H9Zasp/I8bHlaJZyFqNcJjFS	2025-10-04 10:02:40.578	2025-10-04 10:03:46.52	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjg0LCJsb2dpbiI6IllvdW5uaSIsImlhdCI6MTc1OTU3MjE2MCwiZXhwIjoxNzYwMTc2OTYwfQ.1qgQsQe05BPCOp5EWreMBRbHqeC8EpQHwzageENJn4o	t	f	\N	Ион Хиким					@younni			1-3 года	\N	f	f	f	\N	\N	1	offline	\N	\N
117	sdeverley	bristolllf@gmail.com	$2b$10$p80GtBsQMV7XKdkdlCReteVGM4RdF1fMi5mLCrGMshAcmHK/VY0AG	2025-10-06 08:06:57.422	2025-10-06 08:12:33.311	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjExNywibG9naW4iOiJzZGV2ZXJsZXkiLCJpYXQiOjE3NTk3MzgwMTcsImV4cCI6MTc2MDM0MjgxN30._CkMaeJg1lDknzt9OJ_C-UwLjCQz8IyhOHYdP0qFcAA	t	f	\N	Svetlana Kopaneva	Нижний Новгород	В настоящее время я работаю в Т-Банке стажером в отделе социальных сетей на позиции SMM-менеджера. Моя стажировка заканчивается 17 декабря, и, к сожалению, продолжить работу в компании не получится, так как в штате нет открытых вакансий на позицию SMM-менеджера. Поэтому я ищу команду, где смогу применить полученный опыт и продолжить расти.\n\nВ Т-Банке я создаю контент для Telegram-канала, ВКонтакте и Пульс: пишу тексты о вакансиях и карьерных возможностях, принимаю участие в создании и запуске спецпроекта, готовлю ТЗ для дизайнеров, составляю контент-план и работаю с аналитикой в LiveDune. Благодаря этому я научилась воспринимать соцсети не как набор постов, а как инструмент, который помогает бизнесу и команде находить своих людей.\n\nСейчас я параллельно прохожу профессиональную переподготовку по специальности «Маркетолог», чтобы глубже изучить стратегическое планирование и современные методы продвижения.\n\nХочу быть частью команды, где можно экспериментировать с форматами, искать креативные решения и видеть, как результат моей работы напрямую влияет на отклик аудитории.	Junior	9867264131	sdeverley			Менее года	\N	f	f	f	\N	\N	1	offline	\N	\N
118	eskoej	dkasanova449@gmail.com	$2b$10$UedmuecQh4ns4XHWyiHE2u5WsmmnhAH2ulTTlTwGNEEI.8rvnePie	2025-10-06 08:09:23.149	2025-10-06 08:40:13.666	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjExOCwiaWF0IjoxNzU5NzQwMDEzLCJleHAiOjE3NjAzNDQ4MTN9.99zh_obtjAFdbLJPNhAWTuqU1RpS-wsAeUa5_PhNIiY	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N
18	epica	alexeev230704@gmail.com	$2b$10$QbyOuNYkwlDTXmJtxRGiF.g/TtbqbDKi1Yalg5O7UCu.zGNurrB6S	2025-09-17 10:51:56.966	2025-10-12 21:59:29.256	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE4LCJpYXQiOjE3NjAzMDYzNjksImV4cCI6MTc2MDkxMTE2OX0.L9SRe5ZB-ZlnF6X5juJeMZy7dyMhXY0Y0arz5F55x3k	t	f	1758134936838-389670038.png	Александр Алексеев	Москва							3-6 лет	1758106460249-127038363.png	f	f	f	\N	\N	1	offline	\N	\N
51	stanislavd491	stanislavd491@gmail.com	$2b$10$BhwyctgYGYjeHAyVHvO5XOvnCB9mv4zPtYhmLgKTsvhzpg.aVtA3y	2025-09-24 09:57:02.823	2025-09-24 12:19:40.808	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUxLCJsb2dpbiI6InN0YW5pc2xhdmQ0OTEiLCJpYXQiOjE3NTg3MTYzODAsImV4cCI6MTc1OTMyMTE4MH0.nKIFYH0tsh_RKDGLngzvDcHutOLu-5DU9o-KdHHexiY	t	f	1758708790761-957759653.jpg	Станислав									\N	f	f	f	\N	\N	1	offline	\N	\N
580	aseeev	ilya.aseev.2000@mail.ru	$2b$10$kH/gCpbq/jXHewRgCd244uJvgvPpCm2fpf6dtamUGmTzpET/lt2Xu	2025-10-11 10:26:34.216	2025-10-11 10:26:34.235	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjU4MCwibG9naW4iOiJhc2VlZXYiLCJpYXQiOjE3NjAxNzgzOTQsImV4cCI6MTc2MDc4MzE5NH0.8xGJFRPctGy_A8XpWmsxltvMRtdTBwIjurkHs1CwpwA	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N
183	LevinaTK	Tanya472003@gmail.com	$2b$10$FCngGOMBdEeIBQ4BNy.pI.c1oxkaJXqcuKwaX6GKytDknkglBR/8.	2025-10-07 07:58:55.405	2025-10-08 13:23:20.272	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE4MywiaWF0IjoxNzU5OTI5ODAwLCJleHAiOjE3NjA1MzQ2MDB9.4yLJpfvCBhCU9MVGr_FaKS0CBEZj2fCgu94W0c28Mk4	t	f	\N	Татьяна Левина	Луганск			+79591823081	@Levinatk	https://vk.com/levinatk		Более 6 лет	\N	f	f	f	\N	\N	1	offline	\N	\N
150	SapunA	natalasapunkova112@gmail.com	$2b$10$ED5pxgUhHaY2IV39jMOLIe6Hf1R5tpxaZyvMSu6/FzNATZOE9e6S2	2025-10-06 08:11:05.51	2025-10-06 08:11:35.259	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE1MCwibG9naW4iOiJTYXB1bkEiLCJpYXQiOjE3NTk3MzgyNjUsImV4cCI6MTc2MDM0MzA2NX0.KY-3mFaNGt22-esy7JOXowOfF0sA5Wig7a6aNrgjerw	t	f	\N	Наталья Сапункова	Барнаул			89130995143					\N	f	f	f	\N	\N	1	offline	\N	\N
316	VikiKuzmina95	yagodckaviktoria@yandex.ru	$2b$10$6XqA96Iv2Z.1.gzGI6i43.PiQtuZ7u2K3kjFswRVpbLbmgOZx.Oem	2025-10-10 10:32:51.944	2025-10-10 10:33:18.375	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMxNiwibG9naW4iOiJWaWtpS3V6bWluYTk1IiwiaWF0IjoxNzYwMDkyMzcxLCJleHAiOjE3NjA2OTcxNzF9.CVQC0A-gw4Moh3jz391JmSPzW3ImiYE49db4-JEESjc	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N
349	gelmanmax	gelmanmax@gmail.com	$2b$10$E8uo5SeEgdD.5RW4epno5Os256Rf2W15jr1nWaTuLVZLEY/9mzqaa	2025-10-10 12:35:25.744	2025-10-10 12:35:25.772	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjM0OSwibG9naW4iOiJnZWxtYW5tYXgiLCJpYXQiOjE3NjAwOTk3MjUsImV4cCI6MTc2MDcwNDUyNX0.1eCrtkIWnXN884NuAku4D9P3p_JvBUdJxjjtrxLrNrI	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N
415	Agata.K	kostyukovaagata@mail.ru	$2b$10$RsvFUqozAsvhoLm7Lfk02.dcqAUghZZ7t3UKd0c3gcaxXWvwz7DRq	2025-10-10 15:30:44.793	2025-10-10 15:32:03.737	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQxNSwibG9naW4iOiJBZ2F0YS5LIiwiaWF0IjoxNzYwMTEwMjQ0LCJleHAiOjE3NjA3MTUwNDR9.T16bjbR05LF3zD_WbdOvt_jXgxqWbQjHak22RN0w8aY	t	f	1760110304013-402406214.jpeg	Агата Костюкова	Витебск								1760110323692-341318632.png	f	f	f	\N	\N	1	offline	\N	\N
382	shpolinart	shpolinart@yandex.kz	$2b$10$2LaXvmMe8NK7PQYtoSi6b.ZvVZgI4yslckEY/tM61a07GdhB2xmT.	2025-10-10 13:03:09.922	2025-10-10 13:03:09.94	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjM4MiwibG9naW4iOiJzaHBvbGluYXJ0IiwiaWF0IjoxNzYwMTAxMzg5LCJleHAiOjE3NjA3MDYxODl9.ml1u5F0fSM0NDWd7XmRh8QMvMsqGD5gjnyH0bgyHypA	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N
250	ktleilaxu	ohmudak@gmail.com	$2b$10$8C5ltz.Z0XpO2r4XN8bpeOuaUgjs9bgppWHx/U/hrjbPll.k22vbm	2025-10-08 10:10:03.399	2025-10-08 10:10:03.456	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI1MCwibG9naW4iOiJrdGxlaWxheHUiLCJpYXQiOjE3NTk5MTgyMDMsImV4cCI6MTc2MDUyMzAwM30.QnYDa1ubEBr1sgHokA7xd0ipPdSn6x309dPJJ6YvwuI	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N
448	Shekvera	vera.shek.05@bk.ru	$2b$10$aB4PHqD2wj3nYVRfvWWMPOu6S6FCAu8yrYKdAQ6LhtW4jFc./5DBO	2025-10-10 16:36:53.21	2025-10-10 16:36:53.231	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQ0OCwibG9naW4iOiJTaGVrdmVyYSIsImlhdCI6MTc2MDExNDIxMywiZXhwIjoxNzYwNzE5MDEzfQ.G49cxVWERpl8psNpIxyDNU4fhcvjF6ICqCQWNnMXE2c	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N
547	Miron	tatanasapel232@gmail.com	$2b$10$HfEgMjXaVBX5Aj78pg4BPes9E0u1wE2KG3WNTWVyuFadnEdEl3hRu	2025-10-11 08:23:03.952	2025-10-11 08:25:00.533	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjU0NywibG9naW4iOiJNaXJvbiIsImlhdCI6MTc2MDE3MDk4NCwiZXhwIjoxNzYwNzc1Nzg0fQ.jsOUIVxydmVrr5OOLNKUqU3xhmasOrT4IWHuGWraYrE	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N
481	problesk	probleskagency@gmail.com	$2b$10$2dWoTDuE7heA2iP3q6Zd9OGIqSOsQ.jDSF4N0HrDGpUWNap/FPvyG	2025-10-10 17:20:34.34	2025-10-10 17:20:34.385	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQ4MSwibG9naW4iOiJwcm9ibGVzayIsImlhdCI6MTc2MDExNjgzNCwiZXhwIjoxNzYwNzIxNjM0fQ.mhSEDdfrT9IITr_Uzp1CE9efZNvf7Wu0XQmCkDLNz0g	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N
217	Safronov Artem	safronovwork0@gmail.com	$2b$10$as6RrUGr5RYGGGIgxfz8/eilsJylB/vD2nGQ5hrJp/s4uKxkaGO1W	2025-10-07 13:04:41.617	2025-10-13 15:04:56.45	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIxNywiaWF0IjoxNzYwMzY3ODk2LCJleHAiOjE3NjA5NzI2OTZ9.lEeo9Iiy94eSyCRCWDKmigY0jDZW6N5sztlQpd33ZEs	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	3	online	2026-01-05 13:04:23.336	2025-10-07 13:04:23.336
646	WorkerFullStack	kay.li@internet.ru	$2b$10$ji8GLt9hRKq.ZS1ElX06UOaibO59OQbWrHzl1uEjyYTeKDi.DpvP.	2025-10-12 12:21:14.993	2025-10-12 12:23:31.578	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjY0NiwibG9naW4iOiJXb3JrZXJGdWxsU3RhY2siLCJpYXQiOjE3NjAyNzE4MTEsImV4cCI6MTc2MDg3NjYxMX0.IEgRBwK6DnXt3wUQ3IpaJgrndnidwTUTUQZaxvPXsAE	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N
613	89505234844	angel.bestaeva@yandex.ru	$2b$10$ZQZkel8RtcY8DarEzmm0SOcxVSXEo4pvx/ONPt3QhMaU67ENSzj/m	2025-10-11 10:46:33.67	2025-10-11 10:51:01.789	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjYxMywibG9naW4iOiI4OTUwNTIzNDg0NCIsImlhdCI6MTc2MDE3OTU5MywiZXhwIjoxNzYwNzg0MzkzfQ.wwhQOZgv1fmoIEh7P9d8JgPZLYGTPLiKoCIOJVcKQ24	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N
514	Оксана	oksana71.11@mail.ru	$2b$10$bEMm0Ct6EfcgAJvGE4NNe.MJtCgGc/6cHVluw7A61pzyTfIbuT3Hi	2025-10-11 08:11:08.886	2025-10-11 08:35:25.194	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUxNCwiaWF0IjoxNzYwMTcxNzI1LCJleHAiOjE3NjA3NzY1MjV9.sXp4t1eKUXh_qL0qz8tmpEs5aLf5sqDBE8lB3M9XdCc	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N
283	Elizaveta	elizaveta-s04@mail.ru	$2b$10$uDXcjI2Jg5TzOSB1.RJgt.vH0eATZBjaWH2dyQ4TG0QxmpCh0MzDu	2025-10-09 11:31:04.91	2025-10-13 10:01:37.759	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI4MywiaWF0IjoxNzYwMzQ5Njk3LCJleHAiOjE3NjA5NTQ0OTd9.7Sfa_kuN8lVbWg4bIppAzYlIttQbEN_P1fp_5G0L9xk	t	f	1760016178701-917634195.jpg	Елизавета	Москва	Комплексная и масштабируемая система «под ключ»,\nкоторая регулярно приносит заявки\n\n>2 лет в инфобизе, делала запуски от 1 до 7 млн.\nрублей в различных нишах \n\nЭксперты заработали со мной \n\nсуммарно 14+ млн. рублей\n	Middle		@slavicghostgirl			1-3 года	1760291845726-475807369.avif	f	f	f	\N	\N	1	online	\N	\N
679	NogameNolife	nik.maz.bel@gmail.com	$2b$10$Vwf5P8BiCn//PGpzzrgiwOZhTtyUjeF91NY0dob5Tk8GwDUR1Q2Yi	2025-10-12 12:31:33.853	2025-10-12 18:34:47.232	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjY3OSwiaWF0IjoxNzYwMjk0MDg3LCJleHAiOjE3NjA4OTg4ODd9.AN2BoKniZt3jbB0OsBtvsNremKt95OyR6hAX9DUmJ3I	t	f	1760272417696-937602194.jpg	Никита Мазиков	Омск	Занимаюсь ведением проектов по следующим направлениям: \n- SMM\\Сontent менеджмент (работа с полноценным ведением соц сетей, блогов, форумов и иных каналов коммуникаций);\n- Создание SEO оптимизированного контента под внутренние и внешние блоги; \n- Подготовка материалов под выставки и иные оффлайн мероприятия (Лендинги, печатные материалы, стенды, фоновые видеоролики); \n- Менеджмент проектов в области разработки ПО (игровые проекты, геймификация, приложения).\n- СRM менеджмент (рассылки, заведение бонусов и данных программы лояльности, кросс промо).\n\n\nРаботал в нишах: \n- Igaming\\Betting;\n- Сrypto\\Fintech;\n- Ecommerce; \n- Gaming\\Киберспорт.\n\nБыл опыт работы с Регионами: \n- Mena; \n- Latam; \n- Юговосточная азия; \n- Индия, Пакистан, Бангладеш; \n- Страны Ближнего востока; \n- Франкоязычная Африка; \n- CНГ и Восточная Европа.\n\nЗнание языков: \nРусский - Родной; \nАнглийский - C1;\nИтальянский - C1; \nПольский - А2; \n\n	Senior	+79835250775	@Nogameses			Более 6 лет	\N	f	f	f	\N	\N	1	offline	\N	\N
713	Miranqa	miranqaajuga@gmail.com	$2b$10$fh9aGJAnuzznnwlnfwaQD.eyCNAjdff.6Q2nl9pIYc5MZhkyXHoNS	2025-10-14 04:38:54.9	2025-10-14 04:42:27.989	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjcxMywibG9naW4iOiJNaXJhbnFhIiwiaWF0IjoxNzYwNDE2NzM1LCJleHAiOjE3NjEwMjE1MzV9.I__UYDqzTM_msNGkmShfjT7DPoA6cKEs1FdVKG2qHrE	t	f	\N	Zhanna	Gomel			+375296010161	@ingaseotext	@miranqa7		Более 6 лет	\N	f	f	f	\N	\N	1	offline	\N	\N
746	ellielka	kis892727272@gmail.com	$2b$10$D9EoYniUIpwKvuxT04PL3eiJcpzqdE6p3aDrFqOkXY8mw3ighm7MK	2025-10-14 07:30:46.338	2025-10-14 07:30:46.598	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjc0NiwibG9naW4iOiJlbGxpZWxrYSIsImlhdCI6MTc2MDQyNzA0NiwiZXhwIjoxNzYxMDMxODQ2fQ.MMu-gCW8JweO9NcmuH4cDmrOSQvtB6jpBr1qCsdinic	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N
712	Ellizyz	zyskina_liza2505@mail.ru	$2b$10$i0rK3oKg0KGmLwlFGD36oeaDu8go5F1HI20FYFHrOJ7bAgJV87rbi	2025-10-13 10:52:15.289	2025-10-13 11:29:18.944	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjcxMiwibG9naW4iOiJFbGxpenl6IiwiaWF0IjoxNzYwMzU0OTU4LCJleHAiOjE3NjA5NTk3NTh9.v8ZQmWXqDRe-w6Xm9lfKLPJL_-tZsjgXSYIvqpPZouk	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N
\.


--
-- Data for Name: _BlogLikes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_BlogLikes" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _BlogViews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_BlogViews" ("A", "B") FROM stdin;
45	18
\.


--
-- Data for Name: _ProjectLikes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_ProjectLikes" ("A", "B") FROM stdin;
125	18
225	183
258	283
291	283
325	283
358	283
391	283
457	18
258	18
291	18
325	18
358	18
391	18
424	18
\.


--
-- Data for Name: _ProjectViews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_ProjectViews" ("A", "B") FROM stdin;
125	18
92	18
225	183
225	18
92	183
92	283
125	283
291	283
258	283
92	613
325	283
358	283
391	283
424	283
457	18
258	18
291	18
325	18
358	18
391	18
424	18
457	712
258	712
\.


--
-- Data for Name: _User Specializations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_User Specializations" ("A", "B") FROM stdin;
2	84
1	18
3	18
5	18
1	117
1	183
5	183
1	415
1	679
3	679
5	679
1	283
3	283
1	713
3	713
\.


--
-- Data for Name: _UserFollows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_UserFollows" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _UserLikes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_UserLikes" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _UserStarred; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_UserStarred" ("A", "B") FROM stdin;
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, name, description, "photoName", "firstLink", "secondLink", "categoryId", "userId", "specializationId", "updatedAt", "createdAt", "contentHash", "contentPath", "contentSize") FROM stdin;
92	Потеряй все	Как потерять все	1758708049758-338906084.jpg	\N	\N	18	51	3	2025-09-24 10:00:50.564	2025-09-24 10:00:50.424	494046dc23771c6e39cd1be483378f22838e3a4933ff0ab860c573fa9f0c7548	project_92.json	48395
125	Grinar Ведение соц. сетей	Проект посвящен развитию бренда и повышению его узнаваемости. За полтора месяца мы создали брендбук, включающий логотип, цвета, шрифты и правила оформления документации и коммуникаций. Результат — единый стиль и чёткое позиционирование бренда, повысившие привлекательность проекта для аудитории.	1759771844172-93298012.png	\N	\N	8	18	1	2025-10-06 17:30:44.73	2025-09-24 12:02:40.517	ded65c4e88c6ed457d40c31d105b0b21d1e553fc89bb6024fdc7725769805445	project_125.json	2908412
457	Telegram Ads: 57 заявок на Оптовый Пошив Одежды 	Что было\r\n\r\nСайт у которого средняя конверсия с яндекс директ 3% и нецелевые лиды. Клиент пришел с запросом найти рабочие связки с Telegram и полностью перенести весь бюджет.\r\nВ начале работы:\r\n\r\nРешили вести рекламу на сайт, так как других посадочных страниц не было. Цена клика была хорошая, но конверсия сайта 3%, тем самым цена заявки была 1760 рублей. Но я понимала, что мы привлекаем максимально целевую аудиторию, но сайт не конвертит.	1760294721226-853473416.png	\N	\N	7	283	2	2025-10-12 18:45:21.457	2025-10-12 18:45:21.436	1227dba30f3f0811e291678e5c414b727c670df54f73744641305f70b05dda71	project_457.json	3760999
225	Таргет / Магазин гаджетов и игрушек	Star’s case — магазин стильных и креативных аксессуаров для мобильных телефонов и гаджетов.\r\n\r\nВ ассортименте представлены чехлы, защитные стекла, Power Bank, наушники, Bluetooth-колонки, часы, а также множество оригинальных подарков и товаров для настроения.\r\n\r\nМагазин ориентируется на аудиторию, которая ценит дизайн, функциональность и разумные цены. Продажи осуществляются онлайн с доставкой по всей России.\r\n\r\nЦели проекта:\r\nОсновная цель рекламной кампании — увеличение конверсий на сайте (оформление заказов через интернет-магазин) и собрать клиентов из области (исключив сам Луганск).\r\n\r\nДополнительные цели:\r\nПовысить узнаваемость бренда среди целевой аудитории;\r\nПривлечь трафик на сайт из ВКонтакте;\r\nПротестировать гипотезы по форматам креативов и аудиториям для дальнейшей оптимизации рекламы;\r\nСформировать устойчивый интерес к бренду и увеличить долю повторных заказов.\r\n	1759922726868-3250528.png	\N	\N	7	183	2	2025-10-08 11:25:27.151	2025-10-08 11:25:27.125	c10427ad362a227f63344cfaf71f98d6f350a25d9586860fcf1265b2d3e51490	project_225.json	6436334
258	Онлайн проект по фрилансу	Комплексная и масштабируемая система «под ключ»,\r\nкоторая регулярно приносит заявки	1760016720090-660160336.png	\N	\N	9	283	5	2025-10-09 13:32:00.362	2025-10-09 13:32:00.332	11e0ce3914755dda925f9f516e5ae0c74ef593c328deb32e257d21dd41b51864	project_258.json	4009124
291	Запуск обучения по Wildberries на 7.3 млн ₽	Собрать сильный запуск с нуля и показать результат в деньгах и увеличить количество продаж, используя комплексный маркетинг	1760017884248-674378268.png	\N	\N	9	283	5	2025-10-09 13:51:24.681	2025-10-09 13:51:24.652	966f6050e5cbbb00bd0a112a8ff476f860fa28bcb254c228b29a53bc3f13c075	project_291.json	3189637
325	Telegram Ads: +1471 подписчиков по 1,31€ для канала по крипте 	В телеграм-канале было довольно много косяков по упаковке канала, поэтому мы прописали рекомендации и обратную связь клиенту, он оперативно внес все правки и мы уже приступили к подготовке запуска. Сделали хорошее описание, поправили аватарку и основной закреп в канале. 	1760287600355-418198994.png	\N	\N	14	283	2	2025-10-12 16:46:40.404	2025-10-12 16:45:48.086	2787ff40d9d4236627d14fd9f702d5c92ffe31918b9b2e2193c1679d243d43b2	project_325.json	445606
358	Telegram Ads: +698 подписчиков по 1,43€ для онлайн школы по ЕГЭ	Онлайн школа по подготовке к ЕГЭ/ОГЭ\r\n\r\nЧто было:\r\n3 разных телеграм-канала по подготовке к сдаче ЕГЭ, которые ведут 3 разных эксперта по предметам: математика/информатика; обществознание/история; химия/биология. Перед стартом рекламы, как обычно заполнили БРИФ, определили цель нашего сотрудничества и приступили к работе.\r\n\r\nТакже перед стартом мы прописали рекомендации по упаковке каналов на основе своего опыта, со всеми фишками и лайфхаками, поправили описания и закрепы в каналах	1760289025861-275048716.png	\N	\N	9	283	2	2025-10-12 17:10:26.106	2025-10-12 17:10:26.034	cddade04feeeb058293cb95eb482f3b4d98d4fe1efadd15b2a240473a73c8bca	project_358.json	1344582
391	Telegram Ads. Психолог подписчики по 2,27 евро	Телеграм-канал с 200+ подписчиков, перед началом работы мы прописали список рекомендаций по упаковке, доработали описание, пост-закреп, название канала. Также изучили конкурентов, на основе этого дали рекомендации еще и по формату контента и приступили к работе.	1760290131638-221385847.png	\N	\N	8	283	2	2025-10-12 17:28:51.701	2025-10-12 17:28:51.685	72b3954122ea5a5abcb6bb9b42b94a1fcefd138b8314501754791bd1967ee8cc	project_391.json	239429
424	Telegram Ads: +1 828 подписчика по 1,35€ для магазина Айфонов	Кейс по Telegram Ads: +1828 подписчика по 1,35€ для магазина Айфонов\r\nКратко результаты:\r\nВложено — 2461,96€ \r\nПривлечено — 1828 подписчика\r\nЦена подписчика — 1,35€\r\n\r\nЧтобы было:\r\n Есть хороший телеграм канал в который нужен целевой трафик.  \r\n\r\nВ начале работы:\r\nОтобрали 4 сегмента с клиентом:\r\nПрямые конкуренты \r\nСмежные каналы \r\nКаналы по запчастям для айфонов\r\nНовостные каналы по технике	1760291254670-103903622.png	\N	\N	7	283	2	2025-10-12 17:47:34.797	2025-10-12 17:46:25.49	74f1153e9101b6fd4e272045195659e5ea98a1646bb3ad60c4e36aa14499addc	project_424.json	1017283
\.


--
-- Name: Blog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Blog_id_seq"', 110, true);


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Category_id_seq"', 18, true);


--
-- Name: Message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Message_id_seq"', 203, true);


--
-- Name: Payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Payment_id_seq"', 109, true);


--
-- Name: Specialization_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Specialization_id_seq"', 6, true);


--
-- Name: Subscription_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Subscription_id_seq"', 3, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 778, true);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projects_id_seq', 489, true);


--
-- Name: Blog Blog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Blog"
    ADD CONSTRAINT "Blog_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: Specialization Specialization_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Specialization"
    ADD CONSTRAINT "Specialization_pkey" PRIMARY KEY (id);


--
-- Name: Subscription Subscription_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _BlogLikes _BlogLikes_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_BlogLikes"
    ADD CONSTRAINT "_BlogLikes_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _BlogViews _BlogViews_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_BlogViews"
    ADD CONSTRAINT "_BlogViews_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _ProjectLikes _ProjectLikes_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProjectLikes"
    ADD CONSTRAINT "_ProjectLikes_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _ProjectViews _ProjectViews_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProjectViews"
    ADD CONSTRAINT "_ProjectViews_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _User Specializations _User Specializations_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_User Specializations"
    ADD CONSTRAINT "_User Specializations_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _UserFollows _UserFollows_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_UserFollows"
    ADD CONSTRAINT "_UserFollows_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _UserLikes _UserLikes_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_UserLikes"
    ADD CONSTRAINT "_UserLikes_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _UserStarred _UserStarred_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_UserStarred"
    ADD CONSTRAINT "_UserStarred_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: Blog_contentPath_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Blog_contentPath_key" ON public."Blog" USING btree ("contentPath");


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: Payment_externalPaymentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Payment_externalPaymentId_idx" ON public."Payment" USING btree ("externalPaymentId");


--
-- Name: Payment_operationId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Payment_operationId_idx" ON public."Payment" USING btree ("operationId");


--
-- Name: Payment_operationId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Payment_operationId_key" ON public."Payment" USING btree ("operationId");


--
-- Name: Payment_orderId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Payment_orderId_key" ON public."Payment" USING btree ("orderId");


--
-- Name: Payment_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Payment_status_idx" ON public."Payment" USING btree (status);


--
-- Name: Specialization_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Specialization_name_key" ON public."Specialization" USING btree (name);


--
-- Name: Subscription_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Subscription_name_key" ON public."Subscription" USING btree (name);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_login_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_login_key" ON public."User" USING btree (login);


--
-- Name: _BlogLikes_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_BlogLikes_B_index" ON public."_BlogLikes" USING btree ("B");


--
-- Name: _BlogViews_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_BlogViews_B_index" ON public."_BlogViews" USING btree ("B");


--
-- Name: _ProjectLikes_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_ProjectLikes_B_index" ON public."_ProjectLikes" USING btree ("B");


--
-- Name: _ProjectViews_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_ProjectViews_B_index" ON public."_ProjectViews" USING btree ("B");


--
-- Name: _User Specializations_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_User Specializations_B_index" ON public."_User Specializations" USING btree ("B");


--
-- Name: _UserFollows_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_UserFollows_B_index" ON public."_UserFollows" USING btree ("B");


--
-- Name: _UserLikes_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_UserLikes_B_index" ON public."_UserLikes" USING btree ("B");


--
-- Name: _UserStarred_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_UserStarred_B_index" ON public."_UserStarred" USING btree ("B");


--
-- Name: projects_contentPath_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "projects_contentPath_key" ON public.projects USING btree ("contentPath");


--
-- Name: Blog Blog_specializationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Blog"
    ADD CONSTRAINT "Blog_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES public."Specialization"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Blog Blog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Blog"
    ADD CONSTRAINT "Blog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Message Message_receiverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Message Message_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Payment Payment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: User User_subscriptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES public."Subscription"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: _BlogLikes _BlogLikes_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_BlogLikes"
    ADD CONSTRAINT "_BlogLikes_A_fkey" FOREIGN KEY ("A") REFERENCES public."Blog"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _BlogLikes _BlogLikes_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_BlogLikes"
    ADD CONSTRAINT "_BlogLikes_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _BlogViews _BlogViews_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_BlogViews"
    ADD CONSTRAINT "_BlogViews_A_fkey" FOREIGN KEY ("A") REFERENCES public."Blog"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _BlogViews _BlogViews_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_BlogViews"
    ADD CONSTRAINT "_BlogViews_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProjectLikes _ProjectLikes_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProjectLikes"
    ADD CONSTRAINT "_ProjectLikes_A_fkey" FOREIGN KEY ("A") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProjectLikes _ProjectLikes_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProjectLikes"
    ADD CONSTRAINT "_ProjectLikes_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProjectViews _ProjectViews_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProjectViews"
    ADD CONSTRAINT "_ProjectViews_A_fkey" FOREIGN KEY ("A") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProjectViews _ProjectViews_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProjectViews"
    ADD CONSTRAINT "_ProjectViews_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _User Specializations _User Specializations_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_User Specializations"
    ADD CONSTRAINT "_User Specializations_A_fkey" FOREIGN KEY ("A") REFERENCES public."Specialization"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _User Specializations _User Specializations_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_User Specializations"
    ADD CONSTRAINT "_User Specializations_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _UserFollows _UserFollows_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_UserFollows"
    ADD CONSTRAINT "_UserFollows_A_fkey" FOREIGN KEY ("A") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _UserFollows _UserFollows_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_UserFollows"
    ADD CONSTRAINT "_UserFollows_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _UserLikes _UserLikes_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_UserLikes"
    ADD CONSTRAINT "_UserLikes_A_fkey" FOREIGN KEY ("A") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _UserLikes _UserLikes_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_UserLikes"
    ADD CONSTRAINT "_UserLikes_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _UserStarred _UserStarred_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_UserStarred"
    ADD CONSTRAINT "_UserStarred_A_fkey" FOREIGN KEY ("A") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _UserStarred _UserStarred_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_UserStarred"
    ADD CONSTRAINT "_UserStarred_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: projects projects_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT "projects_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: projects projects_specializationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT "projects_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES public."Specialization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: projects projects_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--


