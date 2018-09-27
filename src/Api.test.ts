"use strict"

import { suite, test } from "mocha-typescript"
import * as chai from "chai"
const expect = chai.expect
import * as sinon from "sinon"
import axios from "axios"
import * as moxios from "moxios"
import { readMock } from "./__mocks__/readMock"
import { Api, PagedCallbackResult } from "./Api"

const successResponseJsonObj = JSON.parse(readMock("sample_result"))
const root = "https://example.com/graphql"

@suite
class ApiTests {
  private owner = "github-owner"
  private repoName = "repo-name"

  before() {
    moxios.install()
  }

  after() {
    moxios.uninstall()
  }

  @test
  "makes request"(done) {
    withSuccessfulResponse()

    let api = new Api(root)

    api
      .fetchPullRequests("owner", "repo-name", "token-abcde")
      .then(result => {
        expect(result["data"].repository.pullRequests).to.not.be.null
        done()
      })
      .catch(err => {
        expect(err).to.be.null
        done()
      })
  }

  @test
  "paged requests stop"(done) {
    withSuccessfulResponse()
    let callback = stubbedCallbackForResults([PagedCallbackResult.STOP])
    let api = new Api(root)
    api.fetchPagesOfPullRequests("owner", "repo", "token-abcde", callback).then(() => {
      expect(callback.callCount).to.equal(1)
      done()
    })
  }

  @test
  "paged requests continue"(done) {
    withSuccessfulResponse()
    let callback = stubbedCallbackForResults([
      PagedCallbackResult.CONTINUE,
      PagedCallbackResult.CONTINUE,
      PagedCallbackResult.STOP
    ])
    let api = new Api(root)
    api.fetchPagesOfPullRequests("owner", "repo", "token-abcde", callback).then(() => {
      expect(callback.callCount).to.equal(3)
      done()
    })
  }
}

const stubbedCallbackForResults = (results: any[]): sinon.SinonStub => {
  let callback = sinon.stub()
  results.forEach((value, index) => {
    callback.onCall(index).returns(value)
  })
  return callback
}

const withSuccessfulResponse = () => {
  moxios.stubRequest(root, {
    status: 200,
    response: successResponseJsonObj
  })
}
