exports.up = knex =>
  knex.schema
    .createTable('categories', table => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('avatar').nullable()
      table.timestamps(true, true)
    })

    .createTable('dishes', table => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.text('description').notNullable()
      table.text('ingredients').notNullable()
      table.decimal('price').notNullable()
      table.string('avatar').nullable()
      table
        .integer('category_id')
        .unsigned()
        .references('id')
        .inTable('categories')
      table.timestamps(true, true)
    })

    .createTable('orders', table => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('dish_id').unsigned().references('id').inTable('dishes')
      table.integer('quantity').defaultTo(1)
      table.decimal('dish_price', 10, 2).defaultTo(0)
      table.decimal('total_price', 10, 2).defaultTo(0)
      table.timestamps(true, true)
    })

    .createTable('ratings', table => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('dish_id').unsigned().references('id').inTable('dishes')
      table.integer('rating')
      table.text('comment')
      table.timestamps(true, true)
    })

exports.down = knex =>
  knex.schema
    .dropTableIfExists('ratings')
    .dropTableIfExists('order_dishes')
    .dropTableIfExists('orders')
    .dropTableIfExists('dishes')
    .dropTableIfExists('categories')
