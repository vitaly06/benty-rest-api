--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Ubuntu 14.18-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.18 (Ubuntu 14.18-0ubuntu0.22.04.1)

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


ALTER TABLE public."Blog_id_seq" OWNER TO postgres;

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


ALTER TABLE public."Category_id_seq" OWNER TO postgres;

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


ALTER TABLE public."Message_id_seq" OWNER TO postgres;

--
-- Name: Message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Message_id_seq" OWNED BY public."Message".id;


--
-- Name: ProfileType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProfileType" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."ProfileType" OWNER TO postgres;

--
-- Name: ProfileType_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ProfileType_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ProfileType_id_seq" OWNER TO postgres;

--
-- Name: ProfileType_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ProfileType_id_seq" OWNED BY public."ProfileType".id;


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


ALTER TABLE public."Specialization_id_seq" OWNER TO postgres;

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
    "ratingBoost" integer
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


ALTER TABLE public."Subscription_id_seq" OWNER TO postgres;

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
    "profileTypeId" integer NOT NULL,
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
    status text DEFAULT 'offline'::text NOT NULL
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


ALTER TABLE public."User_id_seq" OWNER TO postgres;

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


ALTER TABLE public.projects_id_seq OWNER TO postgres;

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
-- Name: ProfileType id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProfileType" ALTER COLUMN id SET DEFAULT nextval('public."ProfileType_id_seq"'::regclass);


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
1	Половина россиян не доверяет вопросы управления своими финансами искусственному интеллекту.	1755088308795-535682405.png	blog_1.json	6	f072cbec3bf8841871d4284230c5e983dc211a56837aed862487148f947d1a1f	6	1	2025-08-13 12:31:48.805	2025-08-13 12:31:48.81
4	Как сделать логотип: основные принципы и правила	1755088833390-86462156.png	blog_4.json	6	f072cbec3bf8841871d4284230c5e983dc211a56837aed862487148f947d1a1f	6	5	2025-08-13 12:40:33.396	2025-08-13 12:40:33.402
2	Доверяете ли​ вы финан­совым советам нейро­сетей? Расскажите о своем опыте	1755088539406-813092294.png	blog_2.json	6	f072cbec3bf8841871d4284230c5e983dc211a56837aed862487148f947d1a1f	7	4	2025-08-13 12:35:39.418	2025-08-13 12:43:22.275
3	Лучшие нейросети 2026	1755088710648-904717871.png	blog_3.json	6	f072cbec3bf8841871d4284230c5e983dc211a56837aed862487148f947d1a1f	8	3	2025-08-13 12:38:30.659	2025-08-13 12:43:22.275
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
1	Привет	2025-08-14 09:41:54.031	6	8	\N	f
\.


--
-- Data for Name: ProfileType; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProfileType" (id, name) FROM stdin;
1	Личный
2	Компания
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

COPY public."Subscription" (id, name, "ratingBoost") FROM stdin;
1	default	0
2	pro	10
3	premium	20
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, login, email, password, "profileTypeId", "createdAt", "updatedAt", "refreshToken", "isEmailVerified", "isResetVerified", "logoFileName", "fullName", city, about, level, "phoneNumber", telegram, vk, website, experience, "coverFileName", "joinAuthorsNotifications", "weeklySummaryNotifications", "rewardNotifications", "lastLoginUpdate", "blogId", "subscriptionId", status) FROM stdin;
16	asdfg	egorskomorohov020606@gmai.com	$2b$10$jVGw8VSh79ZjVUDhEwyxtOl157mzzTZEQSRzSKOtxC79aWjRWSwhi	1	2025-08-11 11:39:09.085	2025-08-11 13:29:22.518	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE2LCJpYXQiOjE3NTQ5MTg5NjIsImV4cCI6MTc1NTUyMzc2Mn0.lW4rOWocikwX1ZvxACDkR_vHweCZ0KqG0eTWz7jS0KI	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline
6	vitaly.sadikkov222	vitaly.sadikov1@yandex.ru	$2b$10$Gq9LgS.dwDVeK93Th2ASgud7mrP/IRUyYxN5ccMA5DihzzUffUTR.	1	2025-07-03 11:03:00.473	2025-08-14 09:37:35.814	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjYsImxvZ2luIjoidml0YWx5LnNhZGlra292MjIyIiwiaWF0IjoxNzU1MTY0MjU1LCJleHAiOjE3NTU3NjkwNTV9.7ETno9qn4R556_tpEWd4nVC1Ci5HoCy-Ppx1MsQWQlI	t	f	ava1.png	Садиков Виталий	Оренбург	Я backend разработчик, пишу код на NestJs и учусь.	Middle	+79860271933	@ciganit	vk.com/sobaka	best-backend.ru	Менее года	\N	f	f	f	2025-07-09 07:06:03.17	\N	3	offline
7	vital1y.sadikov	vitaly.sadikov2@yandex.ru	$2b$10$IkWiRHyJr0JYr4EsnTrDL.mEvkjoDc3FnwMhQq9mR0Z9eHdzH.0J.	1	2025-07-04 08:55:39.068	2025-08-11 10:05:38.17	\N	f	f	ava2.png	Афанасий Афанасьевич	Москва	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	2	offline
8	vital1332y.sadikov	vitaly.sadikov232@yandex.ru	$2b$10$Q3/C/I3NtwH6S65bMLJEM.GN09YQzI1F3UuriuFgZ3CfLX7WoNyJK	1	2025-07-04 08:58:47.464	2025-08-11 10:05:38.17	$2b$10$183MhKoCPo2J7OQrDaD3xekd8FOVWTGO5KPagC7JFGet0o8XXOAO2	f	f	ava3.png	Артур Пирожков	Челябинск	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline
9	vitaly.sadikov444	vitaly.sadikov133@yandex.ru	$2b$10$7C4aR3bURQjyA1GvX./VSutZ0dmioRNscT3nl/tnhxgpBUh1fDfIC	1	2025-07-07 11:39:00.097	2025-08-11 10:08:27.076	$2b$10$U.g2pY9cUDT0Zai/wGpq.ulKj8rpXM0nVVtw6MZ0wvI/D2Eh.WIUi	f	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline
11	tgflk	tgflk_tuv@mail.ru	$2b$10$vzwiWqqrOo6OstA.dWHmJuI8.sY/8OJ6hpAEKCPlA7gB.Yi5mOTA6	1	2025-07-14 18:39:22.108	2025-08-11 10:08:27.076	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjExLCJsb2dpbiI6InRnZmxrIiwiaWF0IjoxNzUyNTE4NDEzLCJleHAiOjE3NTMxMjMyMTN9.kWrY-bIHzM0X04J76hk78SeCvFu_5wcHPuep3ANvrCo	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline
12	egorchik-pomidorchik	egor.skomorohoff@yandex.ru	$2b$10$EF.Di5n9b8UF869BYLl.MOsvlJeUCz1SzUEALQNe3/PCYuuHHfrze	1	2025-08-06 10:00:39.34	2025-08-11 10:08:27.076	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyLCJpYXQiOjE3NTQ0ODM4NTUsImV4cCI6MTc1NTA4ODY1NX0.ke0mvfX_vm3zSPQGo_XMd_zg77Z32Qqrw_hNTkgS7WA	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	f	\N	\N	1	offline
\.


--
-- Data for Name: _BlogLikes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_BlogLikes" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _ProjectLikes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_ProjectLikes" ("A", "B") FROM stdin;
8	6
\.


--
-- Data for Name: _ProjectViews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_ProjectViews" ("A", "B") FROM stdin;
7	16
\.


--
-- Data for Name: _User Specializations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_User Specializations" ("A", "B") FROM stdin;
1	6
2	7
1	8
2	9
2	11
\.


--
-- Data for Name: _UserFollows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_UserFollows" ("A", "B") FROM stdin;
7	6
8	6
9	6
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
7	6
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, name, description, "photoName", "firstLink", "secondLink", "categoryId", "userId", "specializationId", "updatedAt", "createdAt", "contentHash", "contentPath", "contentSize") FROM stdin;
10	Брендинг SunVault Eco Energy	Брендинг SunVault Eco Energy	1754412145355-208180517.png	\N	\N	3	6	1	2025-08-05 16:42:25.385	2025-08-05 16:42:25.381	1672dc072e12893d09780f69b9b7e65d83fe74fd8c4c1e8bc12bdf0f97403c14	project_10.json	1076968
13	Тематическое исследование: Дизайн музыкального приложения	Тематическое исследование: Дизайн музыкального приложения	1754413001865-271176779.png	\N	\N	3	6	1	2025-08-05 16:56:42.191	2025-08-05 16:56:42.103	08b4e412ebf605eec21b5d946d62cbda5a004aa3c2a2379a62aec8c2f8670594	project_13.json	714484
16	Syncfine Fintech Branding	Syncfine Fintech Branding	1754413784532-993438299.png	\N	\N	3	6	1	2025-08-05 17:09:44.553	2025-08-05 17:09:44.549	c8fb82d51a176a906bade3b01f2af61d8000f150d0377d12cf1a14d7364180f2	project_16.json	651047
7	Брендинг недвижимости Homotiq	Дизайн для недвижимости Homotiq	1751622214349-830472717.png	\N	\N	3	6	1	2025-08-05 17:17:44.498	2025-08-05 16:24:58.467	682af7867ce883803c1c287ae8fe0a921fc678c8f428ed1dd82b2ec0896230c1	project_7.json	1071317
8	Syncfine Fintech Branding	Lorem Ipsum Syncfine Fintech Branding	1751622474871-653089185.png	\N	\N	3	7	1	2025-08-05 17:18:55.388	2025-08-05 16:35:41.2	6ac587d50b8b34209427b3c8dcb275c92c105d03328bd16e2f35c2243fa292c1	project_8.json	1260812
9	Брендинг недвижимости Homotiq	Брендинг недвижимости Homotiq	1754411991004-100043934.png	\N	\N	3	8	1	2025-08-05 17:18:55.388	2025-08-05 16:39:51.028	7340edbb49de60163bd284279e2c1fe209f466e1ec1e26a9314b39dd963f7025	project_9.json	628044
11	Брендинг фестиваля Visiou	Брендинг фестиваля Visiou\r\n	1754412366025-570242612.png	\N	\N	3	7	1	2025-08-05 17:18:55.388	2025-08-05 16:46:06.071	282e17d903c7d7b50127f1a37edba4846c5f6a05935e20ae4f886798305c7eaa	project_11.json	1215879
12	Nexus — Visual identity	Nexus — Visual identity	1754412588868-395124168.png	\N	\N	3	8	1	2025-08-05 17:18:55.388	2025-08-05 16:49:48.893	6a420a6f690973e041bcd7ca7175ee5a95d46e989b2e94caf4707dbeca8d8cf1	project_12.json	800862
14	Web3Pay© — Visual identity	Web3Pay© — Visual identity	1754413526310-41337425.png	\N	\N	3	7	1	2025-08-05 17:18:55.388	2025-08-05 17:05:26.354	3a198a13838858ecb22bce7440824e3ff809bb84f14133bfe8a9c3935bacb2dd	project_14.json	1578488
15	Брендинг Monly	Брендинг Monly	1754413612709-508022081.png	\N	\N	3	8	1	2025-08-05 17:18:55.388	2025-08-05 17:06:52.719	e27af2a257019d082127a221c19166c168e5e35102de11b1ef29f14b44a5f239	project_15.json	651158
17	Брендинг недвижимости Homotiq	Брендинг недвижимости Homotiq	1754413983781-291074898.png	\N	\N	3	7	1	2025-08-05 17:18:55.388	2025-08-05 17:13:03.806	35ea067a9d942d1a393c4ab3f8a13cb8e573e5b456aa215a93b31b9529bf3270	project_17.json	160225
18	Брендинг SunVault Eco Energy	Брендинг SunVault Eco Energy	1754414109948-902939597.png	\N	\N	3	8	1	2025-08-05 17:18:55.388	2025-08-05 17:15:09.986	a75662d579cb6f3eb6c966f3ae90e3d6cc4fc814204d378b577b6e58c9a9d7c1	project_18.json	1163107
\.


--
-- Name: Blog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Blog_id_seq"', 4, true);


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Category_id_seq"', 18, true);


--
-- Name: Message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Message_id_seq"', 1, true);


--
-- Name: ProfileType_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ProfileType_id_seq"', 2, true);


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

SELECT pg_catalog.setval('public."User_id_seq"', 16, true);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projects_id_seq', 18, true);


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
-- Name: ProfileType ProfileType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProfileType"
    ADD CONSTRAINT "ProfileType_pkey" PRIMARY KEY (id);


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
-- Name: ProfileType_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ProfileType_name_key" ON public."ProfileType" USING btree (name);


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
    ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_profileTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_profileTypeId_fkey" FOREIGN KEY ("profileTypeId") REFERENCES public."ProfileType"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


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
-- PostgreSQL database dump complete
--

