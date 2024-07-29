/* eslint-disable prettier/prettier */
import LeftbarItem from '#models/leftbar_item'
import Project from '#models/project'
import Topbar from '#models/topbar'
import Version from '#models/version'
import { createProjectValidator } from '#validators/project'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ProjectsController {
  async index({ auth, response }: HttpContext) {
    const isLogin = await auth.check()

    if (isLogin) {
      const projects = await auth.user!.related('projects').query()

      return response.ok({
        success: true,
        isLogin,
        data: projects,
        message: 'Data fetched successfully',
      })
    }

    // anonymous
    const projects = await Project.query().orderBy('created_at', 'desc').limit(5)
    return response.status(200).json({
      success: true,
      isLogin,
      data: projects,
      message: 'Data fetched successfully',
    })
  }

  async store({ auth, request, response }: HttpContext) {
    const data = await request.validateUsing(createProjectValidator)
    
    const trx = await db.transaction()
    try {
      const user = auth.user!
      user.useTransaction(trx)
      const project = await user.related('projects').create(data)

      const version = await Version.create(
        {
          projectId: project.id,
          name: project.type === 'version' ? '0.0.1' : 'Main',
          isDefault: true,
          visibility: 'public',
        },
        { client: trx }
      )

      const topBar = await Topbar.create(
        {
          versionId: version.id,
          name: 'm',
          isDefault: true,
        },
        { client: trx }
      )

      const leftBar = await LeftbarItem.create(
        {
          topbarId: topBar.id,
          name: 'Introduction',
          order: 1,
          isDefault: true,
          content: '# Introduction\n\nThis is the introduction of your project',
        },
        { client: trx }
      )

      await trx.commit()

      const routeUrl = {
        repository: project.slug,
        version: version.slug,
        topBar: topBar.slug,
        leftBar: leftBar.slug,
        linkBe: `/projects/${project.slug}/versions/${version.slug}/topbars/${topBar.slug}/leftbars/${leftBar.slug}`,
        linkFe: `${project.slug}/${version.slug}/${topBar.slug}/${leftBar.slug}`
      }

      return response.created({
        success: true,
        data: { project, version, topBar, leftBar, routeUrl },
        message: 'Project created successfully',
      })
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  // default url for project
  async defaultUrl({request, params, response }: HttpContext) {
    const project = await Project.findByOrFail('slug', params.slug)

    // jika version dikirim
    let version
    if (request.input('version')) {
      version = await project.related('versions').query().where('slug', request.input('version')).firstOrFail()
    }else {
      version = await project.related('versions').query().where('is_default', true).firstOrFail()
    }

    
    // jika topbar dikirim
    let topbar
    if (request.input('topbar')) {
      topbar = await version.related('topbars').query().where('slug', request.input('topbar')).firstOrFail()
    }else {
      topbar = await version.related('topbars').query().where('is_default', true).firstOrFail()
    }
    
    const leftbarList = await topbar.related('leftbarItems').query().orderBy('order', 'asc').exec()

    // jika leftbar dikirim
    let leftbar
    if (request.input('leftbar')) {
      leftbar = await topbar.related('leftbarItems').query().where('slug', request.input('leftbar')).firstOrFail()
    } else {
      leftbar = await topbar.related('leftbarItems').query().where('is_default', true).firstOrFail()
    }

    const routeUrl = {
      repository: project.slug,
      version: version.slug,
      topbar: topbar.slug,
      leftbar: leftbar.slug,
      linkBe: `/projects/${project.slug}/versions/${version.slug}/topbars/${topbar.slug}/leftbars/${leftbar.slug}`,
      linkFe: `${project.slug}/${version.slug}/${topbar.slug}/${leftbar.slug}`
    }

    return response.ok({
      success: true,
      data: {
        routeUrl,
        leftbar,
        leftbarList : leftbarList
      },
      message: 'routeUrl fetched successfully',
    })
  }
}
