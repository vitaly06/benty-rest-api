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


--
-- Name: AdvertisementType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AdvertisementType" AS ENUM (
    'VACANCY',
    'ORDER'
);


ALTER TYPE public."AdvertisementType" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Advertisement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Advertisement" (
    id integer NOT NULL,
    "photoName" text NOT NULL,
    type public."AdvertisementType" DEFAULT 'VACANCY'::public."AdvertisementType" NOT NULL,
    name text NOT NULL,
    "companyName" text NOT NULL,
    "employmentType" text NOT NULL,
    "jobFormat" text NOT NULL,
    "whatToDo" text NOT NULL,
    expectations text NOT NULL,
    "weOffer" text NOT NULL,
    "minWage" integer NOT NULL,
    "maxWage" integer NOT NULL,
    currency text NOT NULL,
    telegram text,
    vk text,
    email text,
    "userId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Advertisement" OWNER TO postgres;

--
-- Name: Advertisement_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Advertisement_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Advertisement_id_seq" OWNER TO postgres;

--
-- Name: Advertisement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Advertisement_id_seq" OWNED BY public."Advertisement".id;


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
    "subscriptionStartAt" timestamp(3) without time zone,
    "banReason" text,
    "isBanned" boolean DEFAULT false NOT NULL
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
-- Name: Advertisement id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Advertisement" ALTER COLUMN id SET DEFAULT nextval('public."Advertisement_id_seq"'::regclass);


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
-- Data for Name: Advertisement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Advertisement" (id, "photoName", type, name, "companyName", "employmentType", "jobFormat", "whatToDo", expectations, "weOffer", "minWage", "maxWage", currency, telegram, vk, email, "userId", "createdAt") FROM stdin;
1	1760789494888-683010401.png	VACANCY	Middle Frontend Developer	IT Solutions Ltd	Полная занятость	Удаленно	Разрабатывать веб-приложения на React	Опыт работы с React от 2 лет	Гибкий график, ДМС, обучение	80000	150000	RUB	@company_hr	vk.com/company	hr@company.com	845	2025-11-08 13:32:43.539
\.


--
-- Data for Name: Blog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Blog" (id, name, "photoName", "contentPath", "contentSize", "contentHash", "userId", "specializationId", "createdAt", "updatedAt") FROM stdin;
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

COPY public."User" (id, login, email, password, "createdAt", "updatedAt", "refreshToken", "isEmailVerified", "isResetVerified", "logoFileName", "fullName", city, about, level, "phoneNumber", telegram, vk, website, experience, "coverFileName", "joinAuthorsNotifications", "weeklySummaryNotifications", "rewardNotifications", "lastLoginUpdate", "blogId", "subscriptionId", status, "subscriptionEndAt", "subscriptionStartAt", "banReason", "isBanned") FROM stdin;
84	Younni	yummy022007@gmail.com	$2b$10$zMvCMGjLn4cL44uekjb7zOFhsR9k0H9Zasp/I8bHlaJZyFqNcJjFS	2025-10-04 10:02:40.578	2025-10-04 10:03:46.52	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjg0LCJsb2dpbiI6IllvdW5uaSIsImlhdCI6MTc1OTU3MjE2MCwiZXhwIjoxNzYwMTc2OTYwfQ.1qgQsQe05BPCOp5EWreMBRbHqeC8EpQHwzageENJn4o	t	f	\N	Ион Хиким					@younni			1-3 года	\N	f	f	f	\N	\N	1	offline	\N	\N	\N	f
117	sdeverley	bristolllf@gmail.com	$2b$10$p80GtBsQMV7XKdkdlCReteVGM4RdF1fMi5mLCrGMshAcmHK/VY0AG	2025-10-06 08:06:57.422	2025-10-06 08:12:33.311	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjExNywibG9naW4iOiJzZGV2ZXJsZXkiLCJpYXQiOjE3NTk3MzgwMTcsImV4cCI6MTc2MDM0MjgxN30._CkMaeJg1lDknzt9OJ_C-UwLjCQz8IyhOHYdP0qFcAA	t	f	\N	Svetlana Kopaneva	Нижний Новгород	В настоящее время я работаю в Т-Банке стажером в отделе социальных сетей на позиции SMM-менеджера. Моя стажировка заканчивается 17 декабря, и, к сожалению, продолжить работу в компании не получится, так как в штате нет открытых вакансий на позицию SMM-менеджера. Поэтому я ищу команду, где смогу применить полученный опыт и продолжить расти.\n\nВ Т-Банке я создаю контент для Telegram-канала, ВКонтакте и Пульс: пишу тексты о вакансиях и карьерных возможностях, принимаю участие в создании и запуске спецпроекта, готовлю ТЗ для дизайнеров, составляю контент-план и работаю с аналитикой в LiveDune. Благодаря этому я научилась воспринимать соцсети не как набор постов, а как инструмент, который помогает бизнесу и команде находить своих людей.\n\nСейчас я параллельно прохожу профессиональную переподготовку по специальности «Маркетолог», чтобы глубже изучить стратегическое планирование и современные методы продвижения.\n\nХочу быть частью команды, где можно экспериментировать с форматами, искать креативные решения и видеть, как результат моей работы напрямую влияет на отклик аудитории.	Junior	9867264131	sdeverley			Менее года	\N	f	f	f	\N	\N	1	offline	\N	\N	\N	f
118	eskoej	dkasanova449@gmail.com	$2b$10$UedmuecQh4ns4XHWyiHE2u5WsmmnhAH2ulTTlTwGNEEI.8rvnePie	2025-10-06 08:09:23.149	2025-10-06 08:40:13.666	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjExOCwiaWF0IjoxNzU5NzQwMDEzLCJleHAiOjE3NjAzNDQ4MTN9.99zh_obtjAFdbLJPNhAWTuqU1RpS-wsAeUa5_PhNIiY	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N	\N	f
580	aseeev	ilya.aseev.2000@mail.ru	$2b$10$kH/gCpbq/jXHewRgCd244uJvgvPpCm2fpf6dtamUGmTzpET/lt2Xu	2025-10-11 10:26:34.216	2025-10-11 10:26:34.235	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjU4MCwibG9naW4iOiJhc2VlZXYiLCJpYXQiOjE3NjAxNzgzOTQsImV4cCI6MTc2MDc4MzE5NH0.8xGJFRPctGy_A8XpWmsxltvMRtdTBwIjurkHs1CwpwA	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N	\N	f
150	SapunA	natalasapunkova112@gmail.com	$2b$10$ED5pxgUhHaY2IV39jMOLIe6Hf1R5tpxaZyvMSu6/FzNATZOE9e6S2	2025-10-06 08:11:05.51	2025-10-06 08:11:35.259	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE1MCwibG9naW4iOiJTYXB1bkEiLCJpYXQiOjE3NTk3MzgyNjUsImV4cCI6MTc2MDM0MzA2NX0.KY-3mFaNGt22-esy7JOXowOfF0sA5Wig7a6aNrgjerw	t	f	\N	Наталья Сапункова	Барнаул			89130995143					\N	f	f	f	\N	\N	1	offline	\N	\N	\N	f
316	VikiKuzmina95	yagodckaviktoria@yandex.ru	$2b$10$6XqA96Iv2Z.1.gzGI6i43.PiQtuZ7u2K3kjFswRVpbLbmgOZx.Oem	2025-10-10 10:32:51.944	2025-10-10 10:33:18.375	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMxNiwibG9naW4iOiJWaWtpS3V6bWluYTk1IiwiaWF0IjoxNzYwMDkyMzcxLCJleHAiOjE3NjA2OTcxNzF9.CVQC0A-gw4Moh3jz391JmSPzW3ImiYE49db4-JEESjc	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N	\N	f
349	gelmanmax	gelmanmax@gmail.com	$2b$10$E8uo5SeEgdD.5RW4epno5Os256Rf2W15jr1nWaTuLVZLEY/9mzqaa	2025-10-10 12:35:25.744	2025-10-10 12:35:25.772	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjM0OSwibG9naW4iOiJnZWxtYW5tYXgiLCJpYXQiOjE3NjAwOTk3MjUsImV4cCI6MTc2MDcwNDUyNX0.1eCrtkIWnXN884NuAku4D9P3p_JvBUdJxjjtrxLrNrI	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N	\N	f
415	Agata.K	kostyukovaagata@mail.ru	$2b$10$RsvFUqozAsvhoLm7Lfk02.dcqAUghZZ7t3UKd0c3gcaxXWvwz7DRq	2025-10-10 15:30:44.793	2025-10-10 15:32:03.737	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQxNSwibG9naW4iOiJBZ2F0YS5LIiwiaWF0IjoxNzYwMTEwMjQ0LCJleHAiOjE3NjA3MTUwNDR9.T16bjbR05LF3zD_WbdOvt_jXgxqWbQjHak22RN0w8aY	t	f	1760110304013-402406214.jpeg	Агата Костюкова	Витебск								1760110323692-341318632.png	f	f	f	\N	\N	1	offline	\N	\N	\N	f
382	shpolinart	shpolinart@yandex.kz	$2b$10$2LaXvmMe8NK7PQYtoSi6b.ZvVZgI4yslckEY/tM61a07GdhB2xmT.	2025-10-10 13:03:09.922	2025-10-10 13:03:09.94	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjM4MiwibG9naW4iOiJzaHBvbGluYXJ0IiwiaWF0IjoxNzYwMTAxMzg5LCJleHAiOjE3NjA3MDYxODl9.ml1u5F0fSM0NDWd7XmRh8QMvMsqGD5gjnyH0bgyHypA	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N	\N	f
250	ktleilaxu	ohmudak@gmail.com	$2b$10$8C5ltz.Z0XpO2r4XN8bpeOuaUgjs9bgppWHx/U/hrjbPll.k22vbm	2025-10-08 10:10:03.399	2025-10-08 10:10:03.456	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI1MCwibG9naW4iOiJrdGxlaWxheHUiLCJpYXQiOjE3NTk5MTgyMDMsImV4cCI6MTc2MDUyMzAwM30.QnYDa1ubEBr1sgHokA7xd0ipPdSn6x309dPJJ6YvwuI	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N	\N	f
448	Shekvera	vera.shek.05@bk.ru	$2b$10$aB4PHqD2wj3nYVRfvWWMPOu6S6FCAu8yrYKdAQ6LhtW4jFc./5DBO	2025-10-10 16:36:53.21	2025-10-10 16:36:53.231	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQ0OCwibG9naW4iOiJTaGVrdmVyYSIsImlhdCI6MTc2MDExNDIxMywiZXhwIjoxNzYwNzE5MDEzfQ.G49cxVWERpl8psNpIxyDNU4fhcvjF6ICqCQWNnMXE2c	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N	\N	f
547	Miron	tatanasapel232@gmail.com	$2b$10$HfEgMjXaVBX5Aj78pg4BPes9E0u1wE2KG3WNTWVyuFadnEdEl3hRu	2025-10-11 08:23:03.952	2025-10-11 08:25:00.533	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjU0NywibG9naW4iOiJNaXJvbiIsImlhdCI6MTc2MDE3MDk4NCwiZXhwIjoxNzYwNzc1Nzg0fQ.jsOUIVxydmVrr5OOLNKUqU3xhmasOrT4IWHuGWraYrE	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N	\N	f
481	problesk	probleskagency@gmail.com	$2b$10$2dWoTDuE7heA2iP3q6Zd9OGIqSOsQ.jDSF4N0HrDGpUWNap/FPvyG	2025-10-10 17:20:34.34	2025-10-10 17:20:34.385	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQ4MSwibG9naW4iOiJwcm9ibGVzayIsImlhdCI6MTc2MDExNjgzNCwiZXhwIjoxNzYwNzIxNjM0fQ.mhSEDdfrT9IITr_Uzp1CE9efZNvf7Wu0XQmCkDLNz0g	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N	\N	f
646	WorkerFullStack	kay.li@internet.ru	$2b$10$ji8GLt9hRKq.ZS1ElX06UOaibO59OQbWrHzl1uEjyYTeKDi.DpvP.	2025-10-12 12:21:14.993	2025-10-12 12:23:31.578	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjY0NiwibG9naW4iOiJXb3JrZXJGdWxsU3RhY2siLCJpYXQiOjE3NjAyNzE4MTEsImV4cCI6MTc2MDg3NjYxMX0.IEgRBwK6DnXt3wUQ3IpaJgrndnidwTUTUQZaxvPXsAE	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N	\N	f
18	epica	alexeev230704@gmail.com	$2b$10$QbyOuNYkwlDTXmJtxRGiF.g/TtbqbDKi1Yalg5O7UCu.zGNurrB6S	2025-09-17 10:51:56.966	2025-10-16 11:26:24.843	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE4LCJpYXQiOjE3NjA2MTM5ODQsImV4cCI6MTc2MTIxODc4NH0.nWIDoczvtlzVE7Qq1nvlJX2vCKd-Ur3blmHOQ4mJ0Jg	t	f	1758134936838-389670038.png	Александр Алексеев	Москва							3-6 лет	1758106460249-127038363.png	f	f	f	\N	\N	1	offline	\N	\N	\N	f
613	89505234844	angel.bestaeva@yandex.ru	$2b$10$ZQZkel8RtcY8DarEzmm0SOcxVSXEo4pvx/ONPt3QhMaU67ENSzj/m	2025-10-11 10:46:33.67	2025-10-11 10:51:01.789	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjYxMywibG9naW4iOiI4OTUwNTIzNDg0NCIsImlhdCI6MTc2MDE3OTU5MywiZXhwIjoxNzYwNzg0MzkzfQ.wwhQOZgv1fmoIEh7P9d8JgPZLYGTPLiKoCIOJVcKQ24	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N	\N	f
514	Оксана	oksana71.11@mail.ru	$2b$10$bEMm0Ct6EfcgAJvGE4NNe.MJtCgGc/6cHVluw7A61pzyTfIbuT3Hi	2025-10-11 08:11:08.886	2025-10-11 08:35:25.194	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjUxNCwiaWF0IjoxNzYwMTcxNzI1LCJleHAiOjE3NjA3NzY1MjV9.sXp4t1eKUXh_qL0qz8tmpEs5aLf5sqDBE8lB3M9XdCc	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N	\N	f
679	NogameNolife	nik.maz.bel@gmail.com	$2b$10$Vwf5P8BiCn//PGpzzrgiwOZhTtyUjeF91NY0dob5Tk8GwDUR1Q2Yi	2025-10-12 12:31:33.853	2025-10-12 18:34:47.232	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjY3OSwiaWF0IjoxNzYwMjk0MDg3LCJleHAiOjE3NjA4OTg4ODd9.AN2BoKniZt3jbB0OsBtvsNremKt95OyR6hAX9DUmJ3I	t	f	1760272417696-937602194.jpg	Никита Мазиков	Омск	Занимаюсь ведением проектов по следующим направлениям: \n- SMM\\Сontent менеджмент (работа с полноценным ведением соц сетей, блогов, форумов и иных каналов коммуникаций);\n- Создание SEO оптимизированного контента под внутренние и внешние блоги; \n- Подготовка материалов под выставки и иные оффлайн мероприятия (Лендинги, печатные материалы, стенды, фоновые видеоролики); \n- Менеджмент проектов в области разработки ПО (игровые проекты, геймификация, приложения).\n- СRM менеджмент (рассылки, заведение бонусов и данных программы лояльности, кросс промо).\n\n\nРаботал в нишах: \n- Igaming\\Betting;\n- Сrypto\\Fintech;\n- Ecommerce; \n- Gaming\\Киберспорт.\n\nБыл опыт работы с Регионами: \n- Mena; \n- Latam; \n- Юговосточная азия; \n- Индия, Пакистан, Бангладеш; \n- Страны Ближнего востока; \n- Франкоязычная Африка; \n- CНГ и Восточная Европа.\n\nЗнание языков: \nРусский - Родной; \nАнглийский - C1;\nИтальянский - C1; \nПольский - А2; \n\n	Senior	+79835250775	@Nogameses			Более 6 лет	\N	f	f	f	\N	\N	1	offline	\N	\N	\N	f
713	Miranqa	miranqaajuga@gmail.com	$2b$10$fh9aGJAnuzznnwlnfwaQD.eyCNAjdff.6Q2nl9pIYc5MZhkyXHoNS	2025-10-14 04:38:54.9	2025-10-14 04:42:27.989	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjcxMywibG9naW4iOiJNaXJhbnFhIiwiaWF0IjoxNzYwNDE2NzM1LCJleHAiOjE3NjEwMjE1MzV9.I__UYDqzTM_msNGkmShfjT7DPoA6cKEs1FdVKG2qHrE	t	f	\N	Zhanna	Gomel			+375296010161	@ingaseotext	@miranqa7		Более 6 лет	\N	f	f	f	\N	\N	1	offline	\N	\N	\N	f
746	ellielka	kis892727272@gmail.com	$2b$10$D9EoYniUIpwKvuxT04PL3eiJcpzqdE6p3aDrFqOkXY8mw3ighm7MK	2025-10-14 07:30:46.338	2025-10-14 07:30:46.598	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjc0NiwibG9naW4iOiJlbGxpZWxrYSIsImlhdCI6MTc2MDQyNzA0NiwiZXhwIjoxNzYxMDMxODQ2fQ.MMu-gCW8JweO9NcmuH4cDmrOSQvtB6jpBr1qCsdinic	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N	\N	f
712	Ellizyz	zyskina_liza2505@mail.ru	$2b$10$i0rK3oKg0KGmLwlFGD36oeaDu8go5F1HI20FYFHrOJ7bAgJV87rbi	2025-10-13 10:52:15.289	2025-10-13 11:29:18.944	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjcxMiwibG9naW4iOiJFbGxpenl6IiwiaWF0IjoxNzYwMzU0OTU4LCJleHAiOjE3NjA5NTk3NTh9.v8ZQmWXqDRe-w6Xm9lfKLPJL_-tZsjgXSYIvqpPZouk	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N	\N	f
217	Safronov Artem	safronovwork0@gmail.com	$2b$10$as6RrUGr5RYGGGIgxfz8/eilsJylB/vD2nGQ5hrJp/s4uKxkaGO1W	2025-10-07 13:04:41.617	2025-10-16 10:30:53.062	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIxNywiaWF0IjoxNzYwNjEwNjUzLCJleHAiOjE3NjEyMTU0NTN9.EIF_v9CwLqbIheJ8eokHQMZzwTcJIYS2hiDJfHwuafM	t	f	1760445853800-648934994.jpg	Артём			Middle					3-6 лет	\N	f	f	f	\N	\N	3	offline	2026-01-05 13:04:23.336	2025-10-07 13:04:23.336	\N	f
812	Constanto	marinakury00@gmail.com	$2b$10$Y3xrLIq15i8/J70KZe6tbuWWQazDBsLBbOlcDPRS/6K18roIXo/0q	2025-10-15 14:31:11.807	2025-10-16 10:36:42.237	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjgxMiwibG9naW4iOiJDb25zdGFudG8iLCJpYXQiOjE3NjA2MTEwMDIsImV4cCI6MTc2MTIxNTgwMn0.xgy721BmxgBB7y8plO3loBAC-4-fxHWhYEHSHq5cBy8	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N	\N	f
779	Yuliyaaa_01_2001	Sazhina-2001@list.ru	$2b$10$CZ8zGBnr5V4sHHe9vaHd/u7iHCgLyt3r14lPSMf0YvOTS9vTwn5j.	2025-10-14 21:22:24.321	2025-10-14 21:22:24.362	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjc3OSwibG9naW4iOiJZdWxpeWFhYV8wMV8yMDAxIiwiaWF0IjoxNzYwNDc2OTQ0LCJleHAiOjE3NjEwODE3NDR9.Sl1agFMF9d8F32BCv1U4N_PPW_7ro1EreaKpLr9Ov6c	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline	\N	\N	\N	f
283	Elizaveta	elizaveta-s04@mail.ru	$2b$10$uDXcjI2Jg5TzOSB1.RJgt.vH0eATZBjaWH2dyQ4TG0QxmpCh0MzDu	2025-10-09 11:31:04.91	2025-10-16 10:41:06.008	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI4MywibG9naW4iOiJFbGl6YXZldGEiLCJpYXQiOjE3NjA2MTEyNjUsImV4cCI6MTc2MTIxNjA2NX0.V-HM761Tkf0UVVUEPr3uRh8OxZWfPhCLEeZ_stY7kIU	t	f	1760016178701-917634195.jpg	Елизавета	Москва	Комплексная и масштабируемая система «под ключ»,\nкоторая регулярно приносит заявки\n\n>2 лет в инфобизе, делала запуски от 1 до 7 млн.\nрублей в различных нишах \n\nЭксперты заработали со мной \n\nсуммарно 14+ млн. рублей\n	Middle		@slavicghostgirl			1-3 года	1760291845726-475807369.avif	f	f	f	\N	\N	1	online	\N	\N	\N	f
183	LevinaTK	Tanya472003@gmail.com	$2b$10$FCngGOMBdEeIBQ4BNy.pI.c1oxkaJXqcuKwaX6GKytDknkglBR/8.	2025-10-07 07:58:55.405	2025-10-15 22:30:35.875	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE4MywiaWF0IjoxNzYwNTY3MzM4LCJleHAiOjE3NjExNzIxMzh9.MptpJSzKP7cYXpOb3ukBvbeR61ngTbJqd7aKRUslfGA	t	f	\N	Татьяна Левина	Луганск	Занимаюсь СММ с 2016 года. Освоила ряд компетенций:\n- аналитика (анализирую ЦА, конкурентов, разрабатываю стратегию по офлайн и онлайн способам продвижения)\n- таргетированная реклама \n- работа с визуалом (создание фирменного стиля, визуального сопровождения постов и монтаж роликов)\n- копирайтинг\n\nДополнительно:\nОкончила магистратуру по направлению "Юриспруденция", в данный момент являюсь куратором инновационного трека федеральной программы "Я в деле" в ЛНР.		+79591823081	@Levinatk	https://vk.com/levinatk		Более 6 лет	\N	f	f	f	\N	\N	1	offline	\N	\N	\N	f
845	vitaly.sadikov	vitaly.sadikov1@yandex.ru	$2b$10$47/yzt0M9xgA9Tr7rNroaOCTzKoD4JO0D/djxoSO.cZFLVLw/NiWS	2025-10-18 11:57:51.178	2025-11-08 11:38:29.829	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjg0NSwibG9naW4iOiJ2aXRhbHkuc2FkaWtvdiIsImlhdCI6MTc2MjYwMTkwOSwiZXhwIjoxNzYzMjA2NzA5fQ.xHlabo_eo8vpLlAB3mJ4LH7epApXICxpfmAKuvKBSNk	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	3	offline	2026-01-16 11:57:25.033	2025-10-18 11:57:25.033	\N	f
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
45	183
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
523	217
125	217
457	217
225	217
258	217
291	217
325	217
358	217
391	217
490	217
\.


--
-- Data for Name: _ProjectViews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_ProjectViews" ("A", "B") FROM stdin;
125	18
225	183
225	18
125	283
291	283
258	283
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
523	217
125	217
457	217
225	217
258	217
291	217
325	217
358	217
391	217
424	217
490	217
125	779
258	779
358	183
258	183
291	183
457	183
490	183
325	183
523	183
125	183
457	283
225	812
258	812
457	812
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
1	415
1	679
3	679
5	679
1	283
3	283
1	713
3	713
1	183
5	183
1	217
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
125	Grinar Ведение соц. сетей	Проект посвящен развитию бренда и повышению его узнаваемости. За полтора месяца мы создали брендбук, включающий логотип, цвета, шрифты и правила оформления документации и коммуникаций. Результат — единый стиль и чёткое позиционирование бренда, повысившие привлекательность проекта для аудитории.	1759771844172-93298012.png	\N	\N	8	18	1	2025-10-06 17:30:44.73	2025-09-24 12:02:40.517	ded65c4e88c6ed457d40c31d105b0b21d1e553fc89bb6024fdc7725769805445	project_125.json	2908412
225	Таргет / Магазин гаджетов и игрушек	Star’s case — магазин стильных и креативных аксессуаров для мобильных телефонов и гаджетов.\r\n\r\nВ ассортименте представлены чехлы, защитные стекла, Power Bank, наушники, Bluetooth-колонки, часы, а также множество оригинальных подарков и товаров для настроения.\r\n\r\nМагазин ориентируется на аудиторию, которая ценит дизайн, функциональность и разумные цены. Продажи осуществляются онлайн с доставкой по всей России.\r\n\r\nЦели проекта:\r\nОсновная цель рекламной кампании — увеличение конверсий на сайте (оформление заказов через интернет-магазин) и собрать клиентов из области (исключив сам Луганск).\r\n\r\nДополнительные цели:\r\nПовысить узнаваемость бренда среди целевой аудитории;\r\nПривлечь трафик на сайт из ВКонтакте;\r\nПротестировать гипотезы по форматам креативов и аудиториям для дальнейшей оптимизации рекламы;\r\nСформировать устойчивый интерес к бренду и увеличить долю повторных заказов.\r\n	1759922726868-3250528.png	\N	\N	7	183	2	2025-10-08 11:25:27.151	2025-10-08 11:25:27.125	c10427ad362a227f63344cfaf71f98d6f350a25d9586860fcf1265b2d3e51490	project_225.json	6436334
258	Онлайн проект по фрилансу	Комплексная и масштабируемая система «под ключ»,\r\nкоторая регулярно приносит заявки	1760016720090-660160336.png	\N	\N	9	283	5	2025-10-09 13:32:00.362	2025-10-09 13:32:00.332	11e0ce3914755dda925f9f516e5ae0c74ef593c328deb32e257d21dd41b51864	project_258.json	4009124
291	Запуск обучения по Wildberries на 7.3 млн ₽	Собрать сильный запуск с нуля и показать результат в деньгах и увеличить количество продаж, используя комплексный маркетинг	1760017884248-674378268.png	\N	\N	9	283	5	2025-10-09 13:51:24.681	2025-10-09 13:51:24.652	966f6050e5cbbb00bd0a112a8ff476f860fa28bcb254c228b29a53bc3f13c075	project_291.json	3189637
391	Telegram Ads. Психолог подписчики по 2,27 евро	Телеграм-канал с 200+ подписчиков, перед началом работы мы прописали список рекомендаций по упаковке, доработали описание, пост-закреп, название канала. Также изучили конкурентов, на основе этого дали рекомендации еще и по формату контента и приступили к работе.	1760290131638-221385847.png	\N	\N	8	283	2	2025-10-12 17:28:51.701	2025-10-12 17:28:51.685	72b3954122ea5a5abcb6bb9b42b94a1fcefd138b8314501754791bd1967ee8cc	project_391.json	239429
325	Telegram Ads: +1471 подписчиков по 1,31€ для канала по крипте 	В телеграм-канале было довольно много косяков по упаковке канала, поэтому мы прописали рекомендации и обратную связь клиенту, он оперативно внес все правки и мы уже приступили к подготовке запуска. Сделали хорошее описание, поправили аватарку и основной закреп в канале. 	1760287600355-418198994.png	\N	\N	14	283	2	2025-10-16 10:42:35.723	2025-10-12 16:45:48.086	d635656424e085012e7658a1ba2d26ebb494da1277bbd96d057da84e778a5bda	project_325.json	445725
424	Telegram Ads: +1 828 подписчика по 1,35€ для магазина Айфонов	Кейс по Telegram Ads: +1828 подписчика по 1,35€ для магазина Айфонов\r\nКратко результаты:\r\nВложено — 2461,96€ \r\nПривлечено — 1828 подписчика\r\nЦена подписчика — 1,35€\r\n\r\nЧтобы было:\r\n Есть хороший телеграм канал в который нужен целевой трафик.  \r\n\r\nВ начале работы:\r\nОтобрали 4 сегмента с клиентом:\r\nПрямые конкуренты \r\nСмежные каналы \r\nКаналы по запчастям для айфонов\r\nНовостные каналы по технике	1760291254670-103903622.png	\N	\N	7	283	2	2025-10-12 17:47:34.797	2025-10-12 17:46:25.49	74f1153e9101b6fd4e272045195659e5ea98a1646bb3ad60c4e36aa14499addc	project_424.json	1017283
358	Telegram Ads: +698 подписчиков по 1,43€ для онлайн школы по ЕГЭ	Онлайн школа по подготовке к ЕГЭ/ОГЭ\r\n\r\nЧто было:\r\n3 разных телеграм-канала по подготовке к сдаче ЕГЭ, которые ведут 3 разных эксперта по предметам: математика/информатика; обществознание/история; химия/биология. Перед стартом рекламы, как обычно заполнили БРИФ, определили цель нашего сотрудничества и приступили к работе.\r\n\r\nТакже перед стартом мы прописали рекомендации по упаковке каналов на основе своего опыта, со всеми фишками и лайфхаками, поправили описания и закрепы в каналах	1760289025861-275048716.png	\N	\N	9	283	2	2025-10-16 10:42:07.886	2025-10-12 17:10:26.034	a23536d06e6ebf638298bb3acbc70b3fd5d3f95b0de780801013a328fbcabc92	project_358.json	1344527
523	Привлечение клиентов в Детский Лагерь» через таргет ВКонтакте	Это открытый скейт-парк в центре Тулы, где дети и подростки катаются, посещают тренировки на скейтах, трюковых самокатах, роликах и трюковых велосипедах.\r\n\r\nРанее с этим клиентом мы полностью упаковали сообщество, построили все виджеты, добавили товары, разработали единый стиль соц сетей и проработали каждый раздел сообщества.\r\n\r\nБлагодаря этому навигация клиента становится легкой и удобной, а конверсия подписчика в лиде значительно выше.	1760447409846-81960647.png	\N	\N	9	217	2	2025-10-14 13:10:10.276	2025-10-14 13:10:10.251	822a681ff423e61853aa71145e2a26e3c8cc808c449372b4e64d9a21b3d678f6	project_523.json	10917168
490	Клиенты для стоматологии» через таргет ВКонтакте	Как заработать стоматологии х10 на рекламных вложениях всего лишь за пол года благодаря Таргету? Рассказал о проблемах и результатах!	1760446045756-54754335.png	\N	\N	3	217	1	2025-10-16 09:08:49.749	2025-10-14 12:43:22.543	ab5d662da3e0936aea071493b5e4e06d682b5dcbc437f83120346ae937ed8c20	project_490.json	1885854
457	Telegram Ads: 57 заявок на Оптовый Пошив Одежды 	Что было\r\n\r\nСайт у которого средняя конверсия с яндекс директ 3% и нецелевые лиды. Клиент пришел с запросом найти рабочие связки с Telegram и полностью перенести весь бюджет.\r\nВ начале работы:\r\n\r\nРешили вести рекламу на сайт, так как других посадочных страниц не было. Цена клика была хорошая, но конверсия сайта 3%, тем самым цена заявки была 1760 рублей. Но я понимала, что мы привлекаем максимально целевую аудиторию, но сайт не конвертит.	1760294721226-853473416.png	\N	\N	7	283	2	2025-10-16 10:41:36.571	2025-10-12 18:45:21.436	81a80840a3c80fe06a9ee4f53a006ea4336bd82ab1375230c007bf2f3ac849e0	project_457.json	3760997
\.


--
-- Name: Advertisement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Advertisement_id_seq"', 1, true);


--
-- Name: Blog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Blog_id_seq"', 176, true);


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

SELECT pg_catalog.setval('public."Payment_id_seq"', 241, true);


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

SELECT pg_catalog.setval('public."User_id_seq"', 1042, true);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projects_id_seq', 621, true);


--
-- Name: Advertisement Advertisement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Advertisement"
    ADD CONSTRAINT "Advertisement_pkey" PRIMARY KEY (id);


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
-- Name: Advertisement Advertisement_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Advertisement"
    ADD CONSTRAINT "Advertisement_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


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
GRANT CREATE ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--


