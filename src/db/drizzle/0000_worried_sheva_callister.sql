CREATE TABLE `sessions_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`timezone` text NOT NULL,
	`reminder` integer NOT NULL,
	`repetition` integer NOT NULL,
	`mode` text NOT NULL,
	`link` text,
	`location` text,
	`description` text,
	`attachments` blob
);
