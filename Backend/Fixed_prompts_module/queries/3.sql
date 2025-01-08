SELECT
	HQ.NAME AS HQ_NAME,
	COALESCE(SUM(T.TARGET_VALUE), 0) AS NOV_TARGET_SALES,
	COALESCE(SUM(S.PRIMARY_SALES), 0) AS NOV_ACTUAL_SALES,
	CASE
		WHEN COALESCE(SUM(T.TARGET_VALUE), 0) > 0 THEN (
			COALESCE(SUM(S.PRIMARY_SALES), 0) / COALESCE(SUM(T.TARGET_VALUE), 0)
		) * 100
		ELSE 0
	END AS NOV_SALES_ACHIEVEMENT_PERCENTAGE
FROM
	SALES S
	JOIN HQ ON S.HQID = HQ.ID
	LEFT JOIN TARGET T ON S.HQID = T.HQID
	AND DATE_PART('year', T.TARGET_DATE) = 2024
	AND DATE_PART('month', T.TARGET_DATE) = 11
WHERE
	S.TRANSACTION_DATE BETWEEN '2024-11-01' AND '2024-11-30'
GROUP BY
	HQ.NAME
ORDER BY
	HQ.NAME;