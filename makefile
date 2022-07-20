deploy:
	git push heroku master
	heroku run npm run seed
