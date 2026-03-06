ALTER TABLE "usersSync" RENAME TO "users_sync";--> statement-breakpoint
ALTER TABLE "articles" DROP CONSTRAINT "articles_author_id_usersSync_id_fk";
--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_users_sync_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users_sync"("id") ON DELETE no action ON UPDATE no action;