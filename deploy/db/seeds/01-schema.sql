--
-- PostgreSQL database dump
--

-- Dumped from database version 11.3 (Debian 11.3-1.pgdg90+1)
-- Dumped by pg_dump version 11.3 (Debian 11.3-1.pgdg90+1)

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
-- Name: prismhr2; Type: SCHEMA; Schema: -; Owner: prismhr2
--

CREATE SCHEMA prismhr2;


ALTER SCHEMA prismhr2 OWNER TO prismhr2;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: User; Type: TABLE; Schema: prismhr2; Owner: prismhr2
--

CREATE TABLE prismhr2."User" (
    id integer NOT NULL,
    "loginName" character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    "displayName" character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE prismhr2."User" OWNER TO prismhr2;

--
-- Name: TABLE "User"; Type: COMMENT; Schema: prismhr2; Owner: prismhr2
--

COMMENT ON TABLE prismhr2."User" IS 'User stores all user information';


--
-- Name: User_id_seq; Type: SEQUENCE; Schema: prismhr2; Owner: prismhr2
--

CREATE SEQUENCE prismhr2."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE prismhr2."User_id_seq" OWNER TO prismhr2;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: prismhr2; Owner: prismhr2
--

ALTER SEQUENCE prismhr2."User_id_seq" OWNED BY prismhr2."User".id;


--
-- Name: User id; Type: DEFAULT; Schema: prismhr2; Owner: prismhr2
--

ALTER TABLE ONLY prismhr2."User" ALTER COLUMN id SET DEFAULT nextval('prismhr2."User_id_seq"'::regclass);


--
-- Name: User User_loginName_key; Type: CONSTRAINT; Schema: prismhr2; Owner: prismhr2
--

ALTER TABLE ONLY prismhr2."User"
    ADD CONSTRAINT "User_loginName_key" UNIQUE ("loginName");


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: prismhr2; Owner: prismhr2
--

ALTER TABLE ONLY prismhr2."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Employee; Type: TABLE; Schema: prismhr2; Owner: prismhr2
--

CREATE TABLE prismhr2."Employee" (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(255) NOT NULL,
    "basicSalary" double precision DEFAULT '0'::double precision NOT NULL,
    "hourPayRate" double precision DEFAULT '0'::double precision,
    "otPayRate" double precision DEFAULT '0'::double precision,
    "lunchHours" double precision DEFAULT '0'::double precision,
    "workHourPerDay" double precision DEFAULT '0'::double precision NOT NULL,
    "offDayPerMonth" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

ALTER TABLE prismhr2."Employee" OWNER TO prismhr2;

--
-- Name: TABLE "Employee"; Type: COMMENT; Schema: prismhr2; Owner: prismhr2
--

COMMENT ON TABLE prismhr2."Employee" IS 'Store all of employee data';

--
-- Name: Employee Employee_pkey; Type: CONSTRAINT; Schema: prismhr2; Owner: prismhr2
--

ALTER TABLE ONLY prismhr2."Employee"
    ADD CONSTRAINT "Employee_pkey" PRIMARY KEY ("id");


--
-- Name: Attendance; Type: TABLE; Schema: prismhr2; Owner: prismhr2
--

CREATE TABLE prismhr2."Attendance" (
  "shiftDate" date NOT NULL,
  "attendanceType" character varying(255) NOT NULL,
  "shiftStartTime" time(6) NOT NULL,
  "shiftEndTime" time(6) NOT NULL,
  "totalHour" double precision DEFAULT '0'::double precision NOT NULL,
  "location" character varying(255) DEFAULT NULL::character varying,
  "EmployeeId" character varying(255) NOT NULL,
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL
);

ALTER TABLE prismhr2."Attendance" OWNER TO prismhr2;

--
-- Name: TABLE "Attendance"; Type: COMMENT; Schema: prismhr2; Owner: prismhr2
--

COMMENT ON TABLE prismhr2."Attendance" IS 'Store all of attendance of employee';

--
-- Name: Attendance Attendance_pkey; Type: CONSTRAINT; Schema: prismhr2; Owner: prismhr2
--

ALTER TABLE ONLY prismhr2."Attendance"
    ADD CONSTRAINT "Attendance_pkey" PRIMARY KEY ("shiftDate", "attendanceType", "EmployeeId");

--
-- Name: Attendance Attendance_fkey; Type: CONSTRAINT; Schema: prismhr2; Owner: prismhr2
--
ALTER TABLE prismhr2."Attendance"
    ADD CONSTRAINT "Attendance_EmployeeId_fkey" FOREIGN KEY ("EmployeeId") REFERENCES prismhr2."Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE;


--
-- Name: Pay; Type: TABLE; Schema: prismhr2; Owner: prismhr2
--

CREATE TABLE prismhr2."Pay" (
  "monthYear" character varying(255) NOT NULL,
  "hourPayRate" double precision DEFAULT '0'::double precision NOT NULL,
  "otPayRate" double precision DEFAULT '0'::double precision NOT NULL,
  "totalRegularHours" double precision DEFAULT '0'::double precision NOT NULL,
  "totalExtraDays" integer,
  "totalOtHours" double precision DEFAULT '0'::double precision,
  "totalHours" double precision DEFAULT '0'::double precision NOT NULL,
  "totalRegularPay" double precision DEFAULT '0'::double precision NOT NULL,
  "totalExtraDaysPay" double precision DEFAULT '0'::double precision,
  "toolbox" double precision DEFAULT '0'::double precision,
  "travel" double precision DEFAULT '0'::double precision,
  "lunchHours" double precision DEFAULT '0'::double precision,
  "totalOtPay" double precision DEFAULT '0'::double precision,
  "totalPay" double precision DEFAULT '0'::double precision NOT NULL,
  "EmployeeId" character varying(255) NOT NULL,
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL
);

ALTER TABLE prismhr2."Pay" OWNER TO prismhr2;

--
-- Name: TABLE "Pay"; Type: COMMENT; Schema: prismhr2; Owner: prismhr2
--

COMMENT ON TABLE prismhr2."Pay" IS 'Store all of pay per month of employee';

--
-- Name: Pay Pay_pkey; Type: CONSTRAINT; Schema: prismhr2; Owner: prismhr2
--

ALTER TABLE ONLY prismhr2."Pay"
    ADD CONSTRAINT "Pay_pkey" PRIMARY KEY ("monthYear", "EmployeeId");

--
-- Name: Pay Pay_fkey; Type: CONSTRAINT; Schema: prismhr2; Owner: prismhr2
--

ALTER TABLE "prismhr2"."Pay"
    ADD CONSTRAINT "Pay_EmployeeId_fkey" FOREIGN KEY ("EmployeeId") REFERENCES prismhr2."Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Name: Pay; Type: TABLE; Schema: prismhr2; Owner: prismhr2
--

CREATE TABLE prismhr2."Holiday"(
    id integer NOT NULL,
    "holidayDate" date NOT NULL,
    descriptions character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

ALTER TABLE prismhr2."Holiday" OWNER TO prismhr2;

--
-- Name: TABLE "Holiday"; Type: COMMENT; Schema: prismhr2; Owner: prismhr2
--

COMMENT ON TABLE prismhr2."Holiday" IS 'Store all public holiday date';

--
-- Name: Holiday_id_seq; Type: SEQUENCE; Schema: prismhr2; Owner: prismhr2
--

CREATE SEQUENCE prismhr2."Holiday_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE prismhr2."Holiday_id_seq" OWNER TO prismhr2;

--
-- Name: Holiday_id_seq; Type: SEQUENCE OWNED BY; Schema: prismhr2; Owner: prismhr2
--

ALTER SEQUENCE prismhr2."Holiday_id_seq" OWNED BY prismhr2."Holiday".id;


--
-- Name: Holiday id; Type: DEFAULT; Schema: prismhr2; Owner: prismhr2
--

ALTER TABLE ONLY prismhr2."Holiday" ALTER COLUMN id SET DEFAULT nextval('prismhr2."Holiday_id_seq"'::regclass);

--
-- Name: User Holiday_pkey; Type: CONSTRAINT; Schema: prismhr2; Owner: prismhr2
--

ALTER TABLE ONLY prismhr2."Holiday"
    ADD CONSTRAINT "Holiday_pkey" PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--
