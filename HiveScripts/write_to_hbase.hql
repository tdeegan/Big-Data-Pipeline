CREATE EXTERNAL TABLE career_highs_by_name (
  name string,
  points smallint, rebounds tinyint, assists tinyint, steals tinyint, blocks tinyint,
  turnovers tinyint)
STORED BY 'org.apache.hadoop.hive.hbase.HBaseStorageHandler'
WITH SERDEPROPERTIES ('hbase.columns.mapping' = ':key,stats:points,stats:rebounds,stats:assists,
stats:steals,stats:blocks,stats:turnovers')
TBLPROPERTIES ('hbase.table.name' = 'career_highs_by_name');

INSERT OVERWRITE TABLE career_highs_by_name
SELECT concat(firstname, lastname), points, rebounds, assists, steals, blocks, turnovers
FROM mbb_summary;