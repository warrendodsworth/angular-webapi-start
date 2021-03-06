﻿using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Web.Models;

//https://msdn.microsoft.com/en-us/data/dn314431.aspx
namespace Test.Mocks
{
  public class MockDbContext : IAppDbContext
  {
    public MockDbContext()
    {
      Posts = new MockPostDbSet();
      Users = new MockUserDbSet();
    }

    public IDbSet<User> Users { get; set; }
    public DbSet<Post> Posts { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Product> Products { get; set; }

    public void MarkAsModified(object item)
    {
    }

    public int SaveChangesCount { get; private set; }

    public int SaveChanges()
    {
      this.SaveChangesCount++;
      return 1;
    }

    public Task<int> SaveChangesAsync()
    {
      this.SaveChangesCount++;
      return Task.FromResult(SaveChanges());
    }
  }

  public class MockPostDbSet : MockDbSet<Post>
  {
    public override Post Find(params object[] keyValues)
    {
      var id = (int) keyValues.Single();
      return this.SingleOrDefault(b => b.Id == id);
    }
  }

  public class MockUserDbSet : MockDbSet<User>
  {
    public override User Find(params object[] keyValues)
    {
      var id = (string) keyValues.Single();
      return this.SingleOrDefault(b => b.Id == id);
    }
  }

  public class MockDbSet<TEntity> : DbSet<TEntity>, IQueryable, IEnumerable<TEntity>, IDbAsyncEnumerable<TEntity>
      where TEntity : class
  {
    ObservableCollection<TEntity> _data;
    IQueryable _query;

    public MockDbSet()
    {
      _data = new ObservableCollection<TEntity>();
      _query = _data.AsQueryable();
    }

    public override TEntity Add(TEntity item)
    {
      _data.Add(item);
      return item;
    }

    public override TEntity Remove(TEntity item)
    {
      _data.Remove(item);
      return item;
    }

    public override TEntity Attach(TEntity item)
    {
      _data.Add(item);
      return item;
    }

    public override TEntity Create()
    {
      return Activator.CreateInstance<TEntity>();
    }

    public override TDerivedEntity Create<TDerivedEntity>()
    {
      return Activator.CreateInstance<TDerivedEntity>();
    }

    public override ObservableCollection<TEntity> Local
    {
      get { return _data; }
    }

    Type IQueryable.ElementType
    {
      get { return _query.ElementType; }
    }

    Expression IQueryable.Expression
    {
      get { return _query.Expression; }
    }

    IQueryProvider IQueryable.Provider
    {
      get { return new MockDbAsyncQueryProvider<TEntity>(_query.Provider); }
    }

    System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
    {
      return _data.GetEnumerator();
    }

    IEnumerator<TEntity> IEnumerable<TEntity>.GetEnumerator()
    {
      return _data.GetEnumerator();
    }

    IDbAsyncEnumerator<TEntity> IDbAsyncEnumerable<TEntity>.GetAsyncEnumerator()
    {
      return new TestDbAsyncEnumerator<TEntity>(_data.GetEnumerator());
    }
  }

  internal class MockDbAsyncQueryProvider<TEntity> : IDbAsyncQueryProvider
  {
    private readonly IQueryProvider _inner;

    internal MockDbAsyncQueryProvider(IQueryProvider inner)
    {
      _inner = inner;
    }

    public IQueryable CreateQuery(Expression expression)
    {
      return new MockDbAsyncEnumerable<TEntity>(expression);
    }

    public IQueryable<TElement> CreateQuery<TElement>(Expression expression)
    {
      return new MockDbAsyncEnumerable<TElement>(expression);
    }

    public object Execute(Expression expression)
    {
      return _inner.Execute(expression);
    }

    public TResult Execute<TResult>(Expression expression)
    {
      return _inner.Execute<TResult>(expression);
    }

    public Task<object> ExecuteAsync(Expression expression, CancellationToken cancellationToken)
    {
      return Task.FromResult(Execute(expression));
    }

    public Task<TResult> ExecuteAsync<TResult>(Expression expression, CancellationToken cancellationToken)
    {
      return Task.FromResult(Execute<TResult>(expression));
    }
  }

  internal class MockDbAsyncEnumerable<T> : EnumerableQuery<T>, IDbAsyncEnumerable<T>, IQueryable<T>
  {
    public MockDbAsyncEnumerable(IEnumerable<T> enumerable)
        : base(enumerable)
    { }

    public MockDbAsyncEnumerable(Expression expression)
        : base(expression)
    { }

    public IDbAsyncEnumerator<T> GetAsyncEnumerator()
    {
      return new TestDbAsyncEnumerator<T>(this.AsEnumerable().GetEnumerator());
    }

    IDbAsyncEnumerator IDbAsyncEnumerable.GetAsyncEnumerator()
    {
      return GetAsyncEnumerator();
    }

    IQueryProvider IQueryable.Provider
    {
      get { return new MockDbAsyncQueryProvider<T>(this); }
    }
  }

  internal class TestDbAsyncEnumerator<T> : IDbAsyncEnumerator<T>
  {
    private readonly IEnumerator<T> _inner;

    public TestDbAsyncEnumerator(IEnumerator<T> inner)
    {
      _inner = inner;
    }

    public void Dispose()
    {
      _inner.Dispose();
    }

    public Task<bool> MoveNextAsync(CancellationToken cancellationToken)
    {
      return Task.FromResult(_inner.MoveNext());
    }

    public T Current
    {
      get { return _inner.Current; }
    }

    object IDbAsyncEnumerator.Current
    {
      get { return Current; }
    }
  }
}