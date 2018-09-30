"use strict"

import { suite, test } from "mocha-typescript"
import * as chai from "chai"
const expect = chai.expect
import { QueryBuilder } from "./QueryBuilder"

@suite
class QueryBuilderTests {
  private owner = "github-owner"
  private repoName = "repo-name"
  private builder = new QueryBuilder()

  before() {
    this.builder = new QueryBuilder().withOwner(this.owner).withRepoName(this.repoName)
  }

  @test
  "renders owner"() {
    expect(this.builder.build()).to.contain("owner:")
    expect(this.builder.build()).to.contain(this.owner)
  }

  @test
  "renders repo name"() {
    expect(this.builder.build()).to.contain("name:")
    expect(this.builder.build()).to.contain(this.repoName)
  }

  @test
  "builds previous page pr query"() {
    const cursor = "before-cursor-abcde"
    this.builder.withBeforeCursor(cursor)
    expect(this.builder.build()).to.contain("before:")
    expect(this.builder.build()).to.contain(cursor)
  }
}
