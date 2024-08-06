import LeftbarItem from '#models/leftbar_item'
import { createLeftbarItemValidator, updateLeftbarItemValidator } from '#validators/leftbar'
import { Authenticator } from '@adonisjs/auth'
import { Authenticators } from '@adonisjs/auth/types'
import type { HttpContext } from '@adonisjs/core/http'
import ResponseError from '#exceptions/respon_error_exception'
import Topbar from '#models/topbar'

export default class LeftbarsController {
  async store({ auth, params, request, response }: HttpContext) {
    const validate = await request.validateUsing(createLeftbarItemValidator)

    const topbar = await this.checkTopbarMustExist(
      auth,
      params.projectSlug,
      params.version,
      params.topbarSlug
    )

    // leftbar dengan order tertinggi
    const lastLeftbarItem = await topbar
      .related('leftbarItems')
      .query()
      .orderBy('order', 'desc')
      .first()

    const leftbarItem = await LeftbarItem.create({
      topbarId: topbar.id,
      name: validate.name,
      order: lastLeftbarItem?.order ? lastLeftbarItem.order + 1 : 1,
      content: validate.content,
      leftbarSeparatorId: validate.sidebarSeparatorId,
    })

    return response.ok({
      success: true,
      data: leftbarItem,
      message: 'Leftbar item created successfully',
    })
  }

  async update({ auth, params, request, response }: HttpContext) {
    const validate = await request.validateUsing(updateLeftbarItemValidator)
    const topBar = await this.checkTopbarMustExist(
      auth,
      params.projectSlug,
      params.version,
      params.topbarSlug
    )

    const leftbarItem = await topBar
      .related('leftbarItems')
      .query()
      .where('slug', params.leftbarSlug)
      .first()

    if (!leftbarItem) {
      throw new ResponseError('Leftbar item not found', { status: 404 })
    }

    await leftbarItem.merge(validate).save()

    return response.ok({
      success: true,
      data: leftbarItem,
      message: 'Leftbar item updated successfully',
    })
  }

  async destroy({ auth, params, response }: HttpContext) {
    const topBar = await this.checkTopbarMustExist(
      auth,
      params.projectSlug,
      params.version,
      params.topbarSlug
    )

    // jika topbar hanya memiliki 1 leftbar item
    const topbars = await topBar.related('leftbarItems').query()
    if (topbars.length === 1) {
      throw new ResponseError('Cannot delete the last leftbar item', { status: 400 })
    }

    const leftbarItem = await topBar
      .related('leftbarItems')
      .query()
      .where('slug', params.leftbarSlug)
      .first()

    if (!leftbarItem) {
      throw new ResponseError('Leftbar item not found', { status: 404 })
    }

    await leftbarItem.delete()
    const firstLeftbarItem = await topBar
      .related('leftbarItems')
      .query()
      .orderBy('order', 'asc')
      .first()

    if (firstLeftbarItem) {
      firstLeftbarItem.isDefault = true
      await firstLeftbarItem.save()
    }

    return response.ok({
      success: true,
      message: 'Leftbar item deleted successfully',
    })
  }

  private async checkTopbarMustExist(
    auth: Authenticator<Authenticators>,
    projectSlug: string,
    versionSlug: string,
    topbarSlug: string
  ): Promise<Topbar> {
    const project = await auth.user!.related('projects').query().where('slug', projectSlug).first()

    if (!project) {
      throw new ResponseError('Project not found', { status: 404 })
    }

    const version = await project.related('versions').query().where('slug', versionSlug).first()
    if (!version) {
      throw new ResponseError('Version not found', { status: 404 })
    }

    const topbar = await version.related('topbars').query().where('slug', topbarSlug).first()
    if (!topbar) {
      throw new ResponseError('Topbar not found', { status: 404 })
    }

    return topbar
  }
}
