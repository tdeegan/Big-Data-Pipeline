--copy over

insert overwrite table mbb select * from mbb_csv
where pts is not null and reb is not null
and ast is not null and stl is not null
and blk is not null and tov is not null;