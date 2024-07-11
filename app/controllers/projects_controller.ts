import Project from '#models/project'
import type { HttpContext } from '@adonisjs/core/http'

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
}
