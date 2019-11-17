-- phpMyAdmin SQL Dump
-- version phpStudy 2014
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2019 年 11 月 03 日 19:19
-- 服务器版本: 5.6.45
-- PHP 版本: 5.2.17

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `newbook`
--

-- --------------------------------------------------------

--
-- 表的结构 `plane`
--

CREATE TABLE IF NOT EXISTS `plane` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pid` varchar(255) NOT NULL DEFAULT '',
  `sort` int(11) NOT NULL DEFAULT '0',
  `title` varchar(255) NOT NULL DEFAULT '',
  `solid` int(11) NOT NULL DEFAULT '0',
  `createdAt` varchar(255) NOT NULL DEFAULT '',
  `updatedAt` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=30 ;

--
-- 转存表中的数据 `plane`
--

INSERT INTO `plane` (`id`, `pid`, `sort`, `title`, `solid`, `createdAt`, `updatedAt`) VALUES
(1, 'card/frontend_1', 0, '前端', 3, '2017-10-03 02:44:12', 'Invalid date'),
(2, 'card/frontend_2', 0, '后端', 3, '2017-10-03 02:44:12', 'Invalid date'),
(3, 'card/english_1', 0, '英语', 3, 'Invalid date', 'Invalid date'),
(4, 'card/express_1', 0, '文学', 3, 'Invalid date', 'Invalid date'),
(5, 'card/pic_1', 0, '图库', 3, 'Invalid date', 'Invalid date'),
(6, 'card/place_1', 0, '地区', 3, 'Invalid date', 'Invalid date'),
(7, 'it_0', 0, '未分类', 1, '2017-10-03 02:44:12', 'Invalid date'),
(8, 'it_1', 0, 'HTML', 1, '2017-10-03 02:44:12', 'Invalid date'),
(9, 'it_2', 0, 'CSS', 1, '2017-10-03 02:44:30', 'Invalid date'),
(10, 'it_3', 0, 'JS', 1, '2017-10-03 02:44:30', 'Invalid date'),
(11, 'it_5', 0, '框架', 1, '2017-10-03 02:44:49', '2017-10-03 02:44:25'),
(12, 'it_6', 0, '后端', 1, '2017-10-03 02:46:56', '2017-10-03 02:46:33'),
(13, 'it_7', 0, '软件', 1, '2017-10-03 08:11:12', '2019-07-21 00:59:46'),
(14, 'it_4', 0, '插件', 1, '2017-12-30 02:23:10', 'Invalid date'),
(15, 'it_8', 0, '工具或库', 1, '2019-07-21 00:59:16', '2019-07-21 00:59:18'),
(16, 'life_12', 1, '动物', 2, '2016-11-24 03:03:55', '2019-10-30 21:09:37'),
(17, 'life_1', 0, '综合', 2, '2016-11-24 03:04:13', 'Invalid date'),
(18, 'life_2', 0, '文学', 2, '2016-11-24 03:05:07', 'Invalid date'),
(19, 'life_4', 0, '财经', 2, '2016-11-24 03:05:42', 'Invalid date'),
(20, 'life_6', 0, '保险', 2, '2017-02-09 12:42:00', 'Invalid date'),
(21, 'life_7', 0, '地理或旅游', 2, '2017-02-09 12:42:49', 'Invalid date'),
(22, 'life_8', 0, '企业或机构', 2, '2017-02-09 12:42:49', 'Invalid date'),
(23, 'life_9', 0, '交通', 2, '2017-02-09 12:43:32', 'Invalid date'),
(24, 'life_22', 0, '储备待整理', 2, '2018-08-04 08:44:40', 'Invalid date'),
(25, 'life_18', 0, '文化', 2, '2018-07-19 07:22:26', 'Invalid date'),
(26, 'life_16', 0, '修身养性', 2, '2018-06-03 06:57:52', 'Invalid date'),
(27, 'life_17', 0, '互联网', 2, '2018-07-15 15:49:21', 'Invalid date'),
(28, 'life_20', 0, '技术', 2, '2018-07-27 03:12:44', 'Invalid date'),
(29, 'life_21', 0, '历史', 2, '2018-08-04 02:18:01', 'Invalid date');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
