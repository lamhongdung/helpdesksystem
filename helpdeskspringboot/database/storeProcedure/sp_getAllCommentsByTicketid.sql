use helpdesk;

-- drop procedure if it exists
drop procedure if exists sp_getAllCommentsByTicketid;

delimiter $$

-- -----------------------------------------------------
-- get all comments by ticket id
--
-- Input parameters:
--
-- 	- in_ticketid: ticket id
-- -----------------------------------------------------

-- call sp_getAllCommentsByTicketid(1)

create procedure sp_getAllCommentsByTicketid(
												in_ticketid int
											)
begin

select 	a.commentid as commentid,
        a.commentDescription as commentDescription,
        a.commenterid as commenterid,
        concat(coalesce(b.lastName,''),' ', coalesce(b.firstName,'')) as commenterName,
        coalesce(b.phone,'') as commenterPhone,
        coalesce(b.email,'') as commenterEmail,
        concat(a.commenterid, ' - ', 
				coalesce(b.lastName,''),' ', coalesce(b.firstName,''),
				'(',coalesce(b.phone,''), ' - ',
                coalesce(b.email,''), ')'
                ) as commenter,
        a.commentDatetime as commentDatetime,
        a.customFilename as customFilename,
        coalesce(c.originalFilename,'') as originalFilename
from comment a
	left join user b on a.commenterid = b.id
    left join filestorage c on a.customFilename = c.customFilename
where a.ticketid = in_ticketid
order by a.commentDatetime desc;
    
end $$

-- call sp_getAllCommentsByTicketid(1)

delimiter ;

