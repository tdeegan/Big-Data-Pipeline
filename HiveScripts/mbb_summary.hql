CREATE TABLE mbb_summary (
  firstname string, lastname string, points smallint,
  rebounds tinyint, assists tinyint, steals tinyint, blocks tinyint, turnovers tinyint
);

INSERT OVERWRITE TABLE mbb_summary
  SELECT firstname, lastname, MAX(pts), MAX(reb), MAX(ast), MAX(stl), MAX(blk), MAX(tov)
  FROM mbb
  GROUP BY firstname, lastname;