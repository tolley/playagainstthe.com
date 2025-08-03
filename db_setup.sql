# A script to create the database schema

# A table to hold the user data
create table users (
	id int unsigned not null auto_increment primary key,
	username varchar(255) unique default '' comment 'Need to allow nulls cause tokens can be created before the user has had a chance to fill out their profile in the case of 3rd party logins',
	password varchar(255) default '' comment 'third party logins wont have passwords so we need to allow nulls',
	email varchar(255) not null,
	verified_email tinyint(1) default 0 comment 'whether or not the email address has been verified',
	source varchar(255) not null,
	source_id varchar(255) default '',
	create_date timestamp,
	last_update timestamp
);


# A trigger to enter the create date and last update for a user when one is inserted
create trigger user_insert
	before insert on users
	for each row set new.create_date = now(),
					new.last_update = now();


# A table to hold email address verification tokens per user
create table email_verify_token (
	id int unsigned not null auto_increment primary key,
	user_id int unsigned not null ,
	token varchar(255) not null,
	create_date timestamp,
	last_update timestamp
);

# A trigger to enter the create date and last update
# for an email_verify_token when one is inserted
create trigger email_verify_token_insert
	before insert on email_verify_token
	for each row set new.create_date = now(),
					new.last_update = now();

# Stores the details of a specific user.
create table user_details (
	id int unsigned  not null auto_increment primary key,
	user_id int unsigned not null comment 'Refers to the user table',
	num_collective_moves int unsigned not null default 0,
	num_individual_victories int unsigned not null default 0,
	num_individual_defeats int unsigned not null default 0,
	sound tinyint default 1
);

# Index for the user details table
create index user_id_idx on user_details (user_id);

# Stores the name of each game that is available
create table game_types (
	id int unsigned not null auto_increment primary key,
	name varchar(255) unique,
	prettyName varchar(255) unique,
	description text,
	mapping int unsigned not null unique
);

# Holds the meta data about a game.  The moves will be stored in mongoDB
create table games (
	id int unsigned not null auto_increment primary key,
	owner_id int unsigned not null comment 'Maps to a user by id',
	game_type int unsigned not null comment 'Maps to the game_type table',
	status enum( 'individual', 'collective', 'finished' ) default 'individual',
	move_data json,
	label varchar(255),
	result varchar(255),
	create_date timestamp default current_timestamp,
	last_update timestamp default current_timestamp on update current_timestamp
);

# A table to keep a list of each available collective queue
create table collective_queue (
	id int unsigned not null auto_increment primary key,
    name varchar(255) unique,
    game_type int unsigned not null,
    create_date timestamp default current_timestamp,
	last_update timestamp default current_timestamp on update current_timestamp    
);

# Test data for game types
insert into game_types 
( name, prettyName, mapping )
values
( 'tictactoe', 'Tic Tac Toe', 2 ),
( 'checkers', 'Checkers', 3 );

# Adds the create date to a game row on insert
create trigger games_insert
	before insert on games
	for each row set new.create_date = now();

# Create indexes on the appropiate columns
create index games_user_id_idx on games (owner_id);
create index last_update_idx on games (last_update);

# Holds tokens that enforce move rights
create table move_tokens (
	id int unsigned not null auto_increment primary key,
	game_id int unsigned not null comment 'Maps to a game by id',
	user_id int unsigned not null comment 'Maps to a user by id',
	active tinyint(1) default 1,
	create_date timestamp default current_timestamp,
	last_update timestamp default current_timestamp on update current_timestamp
);

# move token indexes
create index move_token_game_id on move_tokens (game_id);
create index move_token_user_id on move_tokens (user_id);


# A trigger to set the create_date on move tokens
create trigger move_tokens_insert
	before insert on move_tokens
	for each row set new.create_date = now();


# A trigger to enter the create date and last update for a
# collective queue when one is inserted
create trigger collective_queue_insert
	before insert on collective_queue
	for each row set new.create_date = now(),
					new.last_update = now();


insert into collective_queue 
	( name, game_type )
values
	( 'Tic Tac Toe', 1 ),
	( 'Checkers', 2 );