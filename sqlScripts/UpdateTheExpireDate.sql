-- Update token  expiration date.
-- cat ./UpdateTheExpireDate.sql | mysql -u root -p coherence

DELIMITER //

CREATE PROCEDURE RemoveExpireDate (user_id INT)
BEGIN
	    DECLARE currDate DATETIME;
	    DECLARE expirationDate DATETIME;

    SELECT expiration INTO expirationDate FROM UserTokens WHERE id = user_id;

    SET currDate = NOW();

    IF expirationDate < currDate THEN
        UPDATE userTokens SET expiration = NULL WHERE id = user_id;
	    END IF;

END //

DELIMITER ;

