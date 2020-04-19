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
-- Data for Name: User; Type: TABLE DATA; Schema: prismhr2; Owner: prismhr2
--

INSERT INTO prismhr2."User" (id, "loginName", password, "displayName", email, active, "createdAt", "updatedAt") VALUES (1, 'admin@prismhr2.com', '$argon2i$v=19$m=4096,t=3,p=1$716dMVUePKz7getGLC7aXA$e2WBmQkywAlvqjk/5mh9QS10ZLAs7pJ26nisixr9vrI', 'Admin', 'admin@prismhr2.com', true, '2019-11-04 18:46:56.029+08', '2019-11-04 18:46:57.222+08');


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: prismhr2; Owner: prismhr2
--

SELECT pg_catalog.setval('prismhr2."User_id_seq"', 1, true);

--
-- Data for Name: Employee; Type: TABLE DATA; Schema: prismhr2; Owner: prismhr2
--

INSERT INTO prismhr2."Employee" VALUES ('123456', 'Alex Koh', 'Staff', 1500, 10, 30, 5, 8, '2019-12-06 15:18:23+08', '2019-12-06 15:18:26+08');

--
-- Data for Name: Attendance; Type: TABLE DATA; Schema: prismhr2; Owner: prismhr2
--

INSERT INTO prismhr2."Attendance" VALUES ('2019-11-01', 'DESKERA', '08:00:00', '17:00:00', 1, 0.3, 0.2, 9, '', '123456', '2019-12-06 15:19:30+08', '2019-12-06 15:19:33+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-02', 'DESKERA', '08:00:00', '18:00:00', 1, 0.3, 0.2, 10, '', '123456', '2019-12-06 15:20:11+08', '2019-12-06 15:20:14+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-03', 'DESKERA', '08:00:00', '19:00:00', 1, 0.3, 0.2, 11, '', '123456', '2019-12-06 15:21:44+08', '2019-12-06 15:21:44+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-04', 'DESKERA', '08:00:00', '17:00:00', 1, 0.3, 0.2, 9, '', '123456', '2019-12-06 15:21:44+08', '2019-12-06 15:21:44+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-05', 'DESKERA', '08:00:00', '17:00:00', 1, 0.3, 0.2, 9, '', '123456', '2019-12-06 15:21:44+08', '2019-12-06 15:21:44+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-06', 'DESKERA', '08:02:00', '17:00:00', 1, 0.3, 0.2, 9, '', '123456', '2019-12-06 15:21:44+08', '2019-12-06 15:21:44+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-07', 'DESKERA', '08:06:00', '17:00:00', 1, 0.3, 0.2, 9, '', '123456', '2019-12-06 15:21:44+08', '2019-12-06 15:21:44+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-08', 'DESKERA', '08:00:00', '16:59:00', 1, 0.3, 0.2, 9, '', '123456', '2019-12-06 15:21:44+08', '2019-12-06 15:21:44+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-09', 'DESKERA', '07:55:00', '16:57:00', 1, 0.3, 0.2, 9, '', '123456', '2019-12-06 15:21:44+08', '2019-12-06 15:21:44+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-10', 'DESKERA', '08:00:00', '17:00:00', 1, 0.3, 0.2, 9, '', '123456', '2019-12-06 15:21:44+08', '2019-12-06 15:21:44+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-11', 'DESKERA', '08:00:00', '17:00:00', 1, 0.3, 0.2, 9, '', '123456', '2019-12-06 15:19:30+08', '2019-12-06 15:19:33+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-12', 'DESKERA', '08:00:00', '18:00:00', 1, 0.3, 0.2, 10, '', '123456', '2019-12-06 15:20:11+08', '2019-12-06 15:20:14+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-13', 'DESKERA', '08:00:00', '19:00:00', 1, 0.3, 0.2, 11, '', '123456', '2019-12-06 15:21:44+08', '2019-12-06 15:21:44+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-14', 'DESKERA', '08:00:00', '17:00:00', 1, 0.3, 0.2, 9, '', '123456', '2019-12-06 15:21:44+08', '2019-12-06 15:21:44+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-15', 'DESKERA', '08:00:00', '17:00:00', 1, 0.3, 0.2, 9, '', '123456', '2019-12-06 15:21:44+08', '2019-12-06 15:21:44+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-16', 'DESKERA', '08:02:00', '17:00:00', 1, 0.3, 0.2, 9, '', '123456', '2019-12-06 15:21:44+08', '2019-12-06 15:21:44+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-17', 'DESKERA', '08:06:00', '17:00:00', 1, 0.3, 0.2, 9, '', '123456', '2019-12-06 15:21:44+08', '2019-12-06 15:21:44+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-18', 'DESKERA', '08:00:00', '16:59:00', 1, 0.3, 0.2, 9, '', '123456', '2019-12-06 15:21:44+08', '2019-12-06 15:21:44+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-19', 'DESKERA', '07:55:00', '16:57:00', 1, 0.3, 0.2, 9, '', '123456', '2019-12-06 15:21:44+08', '2019-12-06 15:21:44+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-20', 'DESKERA', '08:00:00', '17:00:00', 1, 0.3, 0.2, 9, '', '123456', '2019-12-06 15:21:44+08', '2019-12-06 15:21:44+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-21', 'DESKERA', '08:00:00', '17:00:00', 1, 0.3, 0.2, 9, '', '123456', '2019-12-06 15:19:30+08', '2019-12-06 15:19:33+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-22', 'DESKERA', '08:00:00', '18:00:00', 1, 0.3, 0.2, 10, '', '123456', '2019-12-06 15:20:11+08', '2019-12-06 15:20:14+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-23', 'DESKERA', '08:00:00', '19:00:00', 1, 0.3, 0.2, 11, '', '123456', '2019-12-06 15:21:44+08', '2019-12-06 15:21:44+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-24', 'DESKERA', '08:00:00', '17:00:00', 1, 0.3, 0.2, 9, '', '123456', '2019-12-06 15:21:44+08', '2019-12-06 15:21:44+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-25', 'DESKERA', '08:00:00', '17:00:00', 1, 0.3, 0.2, 9, '', '123456', '2019-12-06 15:21:44+08', '2019-12-06 15:21:44+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-26', 'DESKERA', '08:02:00', '17:00:00', 1, 0.3, 0.2, 9, '', '123456', '2019-12-06 15:21:44+08', '2019-12-06 15:21:44+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-27', 'DESKERA', '08:06:00', '17:00:00', 1, 0.3, 0.2, 9, '', '123456', '2019-12-06 15:21:44+08', '2019-12-06 15:21:44+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-28', 'DESKERA', '08:00:00', '16:59:00', 1, 0.3, 0.2, 9, '', '123456', '2019-12-06 15:21:44+08', '2019-12-06 15:21:44+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-29', 'DESKERA', '07:55:00', '16:57:00', 1, 0.3, 0.2, 9, '', '123456', '2019-12-06 15:21:44+08', '2019-12-06 15:21:44+08');
INSERT INTO prismhr2."Attendance" VALUES ('2019-11-30', 'DESKERA', '08:00:00', '17:00:00', 1, 0.3, 0.2, 9, '', '123456', '2019-12-06 15:21:44+08', '2019-12-06 15:21:44+08');

--
-- Data for Name: Pay; Type: TABLE DATA; Schema: prismhr2; Owner: prismhr2
--

INSERT INTO prismhr2."Pay" VALUES ('11/2019', 10, 5, 208, null, 350, 558, 1500, null, 1, 0.3, 0.2, 1750, 3250, '123456', '2019-12-06 16:00:35+08', '2019-12-06 16:00:37+08');


--
-- PostgreSQL database dump complete
--
